package com.example.TRANSFAGRI.Controller;

import com.example.TRANSFAGRI.Model.Questionnaire;
import com.example.TRANSFAGRI.Model.QuestionnaireAnswer;
import com.example.TRANSFAGRI.Model.Report;
import com.example.TRANSFAGRI.Repository.QuestionnaireAnswerRepository;
import com.example.TRANSFAGRI.Repository.QuestionnaireRepository;
import com.example.TRANSFAGRI.Repository.ReportRepository;
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

    public ReportController(ReportRepository reportRepository,
                            QuestionnaireRepository questionnaireRepository,
                            QuestionnaireAnswerRepository answerRepository) {
        this.reportRepository = reportRepository;
        this.questionnaireRepository = questionnaireRepository;
        this.answerRepository = answerRepository;
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
        List<QuestionnaireAnswer> answers = answerRepository.findByQuestionnaire_Id(questionnaireId);
        Map<String, Object> agg = new HashMap<>();
        agg.put("questionnaireId", questionnaireId);
        agg.put("titre", q.getTitre());
        agg.put("total_reponses", answers.size());
        // Minimal aggregation: store raw answers count; can be expanded later
        String json = com.fasterxml.jackson.databind.json.JsonMapper.builder().build().createObjectNode()
                .put("questionnaireId", questionnaireId)
                .put("titre", q.getTitre())
                .put("total_reponses", answers.size())
                .toString();
        Report r = new Report("Rapport - " + q.getTitre(), q, LocalDateTime.now(), json);
        return ResponseEntity.ok(reportRepository.save(r));
    }
}
