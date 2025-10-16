package com.example.TRANSFAGRI.Controller;

import com.example.TRANSFAGRI.Model.Questionnaire;
import com.example.TRANSFAGRI.Model.QuestionnaireAnswer;
import com.example.TRANSFAGRI.Model.Report;
import com.example.TRANSFAGRI.Repository.QuestionnaireAnswerRepository;
import com.example.TRANSFAGRI.Repository.QuestionnaireRepository;
import com.example.TRANSFAGRI.Repository.ReportRepository;
import com.example.TRANSFAGRI.Service.MistralApiService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ReportController {

    private final ReportRepository reportRepository;
    private final QuestionnaireRepository questionnaireRepository;
    private final QuestionnaireAnswerRepository answerRepository;
    private final MistralApiService mistralApiService;

    public ReportController(ReportRepository reportRepository,
                            QuestionnaireRepository questionnaireRepository,
                            QuestionnaireAnswerRepository answerRepository,
                            MistralApiService mistralApiService) {
        this.reportRepository = reportRepository;
        this.questionnaireRepository = questionnaireRepository;
        this.answerRepository = answerRepository;
        this.mistralApiService = mistralApiService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('CNEF','PASNFI','ADMIN')")
    public List<Report> list() { return reportRepository.findAll(); }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CNEF','PASNFI','ADMIN')")
    public ResponseEntity<Report> get(@PathVariable Long id) {
        return reportRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/generate/{questionnaireId}")
    @PreAuthorize("hasAnyRole('CNEF','ADMIN')")
    public ResponseEntity<Report> generate(@PathVariable Long questionnaireId) {
        Questionnaire q = questionnaireRepository.findById(questionnaireId).orElse(null);
        if (q == null) return ResponseEntity.notFound().build();
        // One report per questionnaire: reuse the latest if exists, else create. Also dedupe extras.
        Report existing = resolveOrCreateSingleReport(q);
        List<QuestionnaireAnswer> answers = answerRepository.findByQuestionnaire_Id(questionnaireId);
        // Build global aggregation: QCM counts + QRO texts
        var mapper = com.fasterxml.jackson.databind.json.JsonMapper.builder().build();
        var root = mapper.createObjectNode();
        root.put("questionnaireId", questionnaireId);
        root.put("titre", q.getTitre());
        root.put("total_reponses", answers.size());

        // 1) parse questionnaire questions
        java.util.List<java.util.Map<String, Object>> rawQuestions = new java.util.ArrayList<>();
        try {
            var content = q.getJsonContent();
            if (content != null) {
                var node = mapper.readTree(content);
                if (node.isArray()) {
                    var iter = node.elements();
                    while (iter.hasNext()) {
                        var it = iter.next();
                        rawQuestions.add(mapper.convertValue(it, new com.fasterxml.jackson.core.type.TypeReference<java.util.Map<String, Object>>(){}));
                    }
                } else if (node.has("questions")) {
                    var iter = node.get("questions").elements();
                    while (iter.hasNext()) {
                        var it = iter.next();
                        rawQuestions.add(mapper.convertValue(it, new com.fasterxml.jackson.core.type.TypeReference<java.util.Map<String, Object>>(){}));
                    }
                } else if (node.has("questionnaire") && node.get("questionnaire").has("questions")) {
                    var iter = node.get("questionnaire").get("questions").elements();
                    while (iter.hasNext()) {
                        var it = iter.next();
                        rawQuestions.add(mapper.convertValue(it, new com.fasterxml.jackson.core.type.TypeReference<java.util.Map<String, Object>>(){}));
                    }
                }
            }
        } catch (Exception ignored) {}

        record QDef(String key, String label, String type, java.util.List<String> options) {}
        java.util.List<QDef> qdefs = new java.util.ArrayList<>();
        int idx = 0;
        for (var it : rawQuestions) {
            String key = (String) (it.getOrDefault("id", it.getOrDefault("key", "q_" + idx)));
            String label = (String) (it.getOrDefault("intitule", it.getOrDefault("question", it.getOrDefault("label", it.getOrDefault("question_text", "Question " + (idx + 1))))));
            String t = String.valueOf(it.getOrDefault("type", it.getOrDefault("kind", it.getOrDefault("question_type", "")))).toLowerCase();
            String normType = (java.util.List.of("qcm","single","radio","choice","select-one","multiple_choice","scale").contains(t)) ? "single"
                    : (java.util.List.of("qcm_multiple","multi","checkbox","select-multiple").contains(t)) ? "multi"
                    : (java.util.List.of("qro","text","textarea","open","string").contains(t)) ? "text"
                    : (java.util.List.of("number","numeric").contains(t)) ? "number" : "other";
            java.util.List<String> options = new java.util.ArrayList<>();
            Object rawOpts = it.getOrDefault("options", it.getOrDefault("choix", it.getOrDefault("choices", java.util.List.of())));
            if (rawOpts instanceof java.util.List<?> list) {
                for (Object o : list) {
                    if (o instanceof String s) options.add(s);
                    else if (o instanceof java.util.Map<?,?> m) {
                        Object s = m.get("option_text");
                        if (s == null) s = m.get("label");
                        if (s == null) s = m.get("value");
                        if (s != null) options.add(String.valueOf(s));
                    }
                }
            }
            qdefs.add(new QDef(key, label, normType, options));
            idx++;
        }

        // 2) initialize QCM counts and QRO buckets
        var qcmArray = mapper.createArrayNode();
        var qroArray = mapper.createArrayNode();
        java.util.Map<String, com.fasterxml.jackson.databind.node.ObjectNode> countsByKey = new java.util.HashMap<>();
        for (QDef d : qdefs) {
            if (d.type.equals("single") || d.type.equals("multi")) {
                var obj = mapper.createObjectNode();
                obj.put("label", d.label);
                var counts = mapper.createObjectNode();
                for (String opt : d.options) counts.put(opt, 0);
                obj.set("counts", counts);
                obj.set("options", mapper.valueToTree(d.options));
                qcmArray.add(obj);
                countsByKey.put(d.key, counts);
            } else if (d.type.equals("text")) {
                var obj = mapper.createObjectNode();
                obj.put("label", d.label);
                obj.set("responses", mapper.createArrayNode());
                qroArray.add(obj);
            }
        }

        // For QRO responses accumulation
        java.util.Map<String, com.fasterxml.jackson.databind.node.ArrayNode> textsByKey = new java.util.HashMap<>();
        for (int i = 0; i < qroArray.size(); i++) {
            var obj = (com.fasterxml.jackson.databind.node.ObjectNode) qroArray.get(i);
            textsByKey.put(qdefs.stream().filter(d -> d.label.equals(obj.get("label").asText())).map(d -> d.key).findFirst().orElse(""),
                    (com.fasterxml.jackson.databind.node.ArrayNode) obj.get("responses"));
        }

        // 3) walk answers
        for (QuestionnaireAnswer a : answers) {
            try {
                var node = mapper.readTree(a.getJsonAnswers());
                var map = node.has("answers") ? node.get("answers") : node;
                if (map != null && map.isObject()) {
                    var fields = map.fields();
                    while (fields.hasNext()) {
                        var e = fields.next();
                        String key = e.getKey();
                        var val = e.getValue();
                        var countsNode = countsByKey.get(key);
                        if (countsNode != null) {
                            if (val.isArray()) {
                                var arrIter = val.elements();
                                while (arrIter.hasNext()) {
                                    var it = arrIter.next();
                                    String sel = it.asText("");
                                    if (countsNode.has(sel)) countsNode.put(sel, countsNode.get(sel).asInt() + 1);
                                }
                            } else {
                                String sel = val.asText("");
                                if (countsNode.has(sel)) countsNode.put(sel, countsNode.get(sel).asInt() + 1);
                            }
                        }
                        var arr = textsByKey.get(key);
                        if (arr != null) {
                            String txt = val.asText("");
                            if (!txt.isBlank()) arr.add(txt.length() > 600 ? txt.substring(0, 600) + "..." : txt);
                        }
                    }
                }
            } catch (Exception ignored) {}
        }

        root.set("qcm", qcmArray);
        root.set("qro", qroArray);
        String json = root.toString();
        existing.setContentJson(json);
        existing.setGeneratedAt(LocalDateTime.now());
        return ResponseEntity.ok(reportRepository.save(existing));
    }

    @PostMapping("/summarizeByQuestionnaire/{questionnaireId}")
    @PreAuthorize("hasAnyRole('CNEF','ADMIN')")
    public ResponseEntity<Report> summarizeByQuestionnaire(@PathVariable Long questionnaireId) {
        Questionnaire q = questionnaireRepository.findById(questionnaireId).orElse(null);
        if (q == null) return ResponseEntity.notFound().build();
        // Find existing or create a minimal report first
    Report report = resolveOrCreateSingleReport(q);
        return summarize(report.getId());
    }

    @PostMapping("/{id}/summarize")
    @PreAuthorize("hasAnyRole('CNEF','ADMIN')")
    public ResponseEntity<Report> summarize(@PathVariable Long id) {
        Report report = reportRepository.findById(id).orElse(null);
        if (report == null) return ResponseEntity.notFound().build();

        Long qid = report.getQuestionnaire() != null ? report.getQuestionnaire().getId() : null;
        List<QuestionnaireAnswer> answers = qid != null ? answerRepository.findByQuestionnaire_Id(qid) : java.util.Collections.emptyList();

        StringBuilder sb = new StringBuilder();
        sb.append("Tu es un analyste de données. Résume en 5-8 phrases clair et concis les tendances d'un questionnaire. ");
        sb.append("Titre: ").append(report.getQuestionnaire() != null ? report.getQuestionnaire().getTitre() : "").append(". ");
        if (report.getQuestionnaire() != null && report.getQuestionnaire().getJsonContent() != null) {
            String qjson = report.getQuestionnaire().getJsonContent();
            if (qjson.length() > 1000) qjson = qjson.substring(0, 1000) + "...";
            sb.append("Questions (JSON tronqué): ").append(qjson).append(" \n");
        }
        sb.append("Nombre total de réponses: ").append(answers.size()).append(". ");
        int max = Math.min(answers.size(), 10);
        for (int i = 0; i < max; i++) {
            String a = answers.get(i).getJsonAnswers();
            if (a != null && a.length() > 600) a = a.substring(0, 600) + "...";
            sb.append("Réponse ").append(i+1).append(": ").append(a).append(" \n");
        }
        sb.append("Donne aussi 2-3 recommandations actionnables. Rédige en français.");

        String summaryText = mistralApiService.summarize(sb.toString());
        report.setAiSummary(summaryText);
        return ResponseEntity.ok(reportRepository.save(report));
    }

    @PostMapping("/previewSummary/{questionnaireId}")
    @PreAuthorize("hasAnyRole('CNEF','ADMIN')")
    public ResponseEntity<Map<String, String>> previewSummary(@PathVariable Long questionnaireId) {
        Questionnaire q = questionnaireRepository.findById(questionnaireId).orElse(null);
        if (q == null) return ResponseEntity.notFound().build();
        List<QuestionnaireAnswer> answers = answerRepository.findByQuestionnaire_Id(questionnaireId);

        StringBuilder sb = new StringBuilder();
        sb.append("Tu es un analyste de données. Résume en 5-8 phrases clair et concis les tendances d'un questionnaire. ");
        sb.append("Titre: ").append(q.getTitre()).append(". ");
        if (q.getJsonContent() != null) {
            String qjson = q.getJsonContent();
            if (qjson.length() > 1000) qjson = qjson.substring(0, 1000) + "...";
            sb.append("Questions (JSON tronqué): ").append(qjson).append(" \n");
        }
        sb.append("Nombre total de réponses: ").append(answers.size()).append(". ");
        int max = Math.min(answers.size(), 10);
        for (int i = 0; i < max; i++) {
            String a = answers.get(i).getJsonAnswers();
            if (a != null && a.length() > 600) a = a.substring(0, 600) + "...";
            sb.append("Réponse ").append(i+1).append(": ").append(a).append(" \n");
        }
        sb.append("Donne aussi 2-3 recommandations actionnables. Rédige en français.");

        String summaryText = mistralApiService.summarize(sb.toString());
        Map<String, String> res = new HashMap<>();
        res.put("summary", summaryText);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/saveSummary/{questionnaireId}")
    @PreAuthorize("hasAnyRole('CNEF','ADMIN')")
    public ResponseEntity<Report> saveSummary(@PathVariable Long questionnaireId, @RequestBody Map<String, String> payload) {
        Questionnaire q = questionnaireRepository.findById(questionnaireId).orElse(null);
        if (q == null) return ResponseEntity.notFound().build();
        String summary = payload != null ? payload.getOrDefault("summary", null) : null;
        if (summary == null || summary.isBlank()) return ResponseEntity.badRequest().build();
    Report report = resolveOrCreateSingleReport(q);
        report.setAiSummary(summary);
        return ResponseEntity.ok(reportRepository.save(report));
    }

    // Ensure at most one report per questionnaire. If multiples exist, keep the latest and delete the rest.
    private Report resolveOrCreateSingleReport(Questionnaire q) {
        Long questionnaireId = q.getId();
        // Try to get the most recent
        Report latest = reportRepository.findFirstByQuestionnaire_IdOrderByGeneratedAtDesc(questionnaireId).orElse(null);
        // If there are multiples, delete extras (data cleanup)
        List<Report> all = reportRepository.findAllByQuestionnaire_Id(questionnaireId);
        if (all.size() > 1) {
            // Keep 'latest' (if null, keep the first), delete others
            Report keep = latest != null ? latest : all.get(0);
            for (Report r : all) {
                if (!r.getId().equals(keep.getId())) {
                    try { reportRepository.deleteById(r.getId()); } catch (Exception ignored) {}
                }
            }
            latest = keep;
        }
        if (latest != null) {
            return latest;
        }
        // Create a new one if none exists
        var mapper = com.fasterxml.jackson.databind.json.JsonMapper.builder().build();
        String baseJson = mapper.createObjectNode()
                .put("questionnaireId", questionnaireId)
                .put("titre", q.getTitre())
                .toString();
        return reportRepository.save(new Report("Rapport - " + q.getTitre(), q, LocalDateTime.now(), baseJson));
    }
}
