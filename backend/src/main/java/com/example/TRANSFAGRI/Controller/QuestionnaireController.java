package com.example.TRANSFAGRI.Controller;

import com.example.TRANSFAGRI.Dto.QuestionnaireRequestDto;
import com.example.TRANSFAGRI.Dto.QuestionGenerationResponse;
import com.example.TRANSFAGRI.Model.Questionnaire;
import com.example.TRANSFAGRI.Model.QuestionnaireAnswer;
import com.example.TRANSFAGRI.Service.MistralApiService;
import com.example.TRANSFAGRI.Service.QuestionnaireService;
import com.example.TRANSFAGRI.Repository.QuestionnaireAnswerRepository;
import com.example.TRANSFAGRI.Repository.QuestionnaireRepository;
import com.example.TRANSFAGRI.Model.Utilisateur;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/questionnaires")
public class QuestionnaireController {
    @Autowired
    private MistralApiService mistralApiService;
    @Autowired
    private QuestionnaireService questionnaireService;
    @Autowired
    private QuestionnaireAnswerRepository questionnaireAnswerRepository;
    @Autowired
    private QuestionnaireRepository questionnaireRepository;

    @PostMapping("/generate")
    @PreAuthorize("hasRole('CNEF')")
    public ResponseEntity<Questionnaire> generateQuestionnaire(@RequestBody QuestionnaireRequestDto dto) {
        QuestionGenerationResponse gen = mistralApiService.generateQuestionnaire(dto.getDescription());
        Questionnaire questionnaire = new Questionnaire();
        questionnaire.setTitre(dto.getTitre());
        questionnaire.setDescription(dto.getDescription());
        questionnaire.setCreatedAt(LocalDateTime.now());
        try {
            questionnaire.setQuestions(gen.getQuestions());
            questionnaire.setJsonContent(gen.getJsonContent());
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Questionnaire saved = questionnaireService.save(questionnaire);
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<java.util.List<Questionnaire>> list() {
        return ResponseEntity.ok(questionnaireService.getAll());
    }

    // For EMF to list only shared questionnaires
    @GetMapping("/shared")
    @PreAuthorize("hasRole('EMF') or hasRole('CNEF')")
    public ResponseEntity<java.util.List<Questionnaire>> listShared() {
        return ResponseEntity.ok(questionnaireService.getShared());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(questionnaireService.count());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CNEF')")
    public ResponseEntity<Questionnaire> update(@PathVariable Long id, @RequestBody Questionnaire payload) {
        // naive update: load then overwrite basic fields
        var all = questionnaireService.getAll();
        var existing = all.stream().filter(q -> q.getId().equals(id)).findFirst();
        if (existing.isEmpty()) return ResponseEntity.notFound().build();
        Questionnaire q = existing.get();
        q.setTitre(payload.getTitre());
        q.setDescription(payload.getDescription());
        q.setQuestions(payload.getQuestions());
        q.setJsonContent(payload.getJsonContent());
        return ResponseEntity.ok(questionnaireService.save(q));
    }

    @PostMapping("/{id}/share")
    @PreAuthorize("hasRole('CNEF')")
    public ResponseEntity<Questionnaire> share(@PathVariable Long id) {
        var all = questionnaireService.getAll();
        var existing = all.stream().filter(q -> q.getId().equals(id)).findFirst();
        if (existing.isEmpty()) return ResponseEntity.notFound().build();
        Questionnaire q = existing.get();
        q.setShared(true);
        q.setSharedAt(LocalDateTime.now());
        return ResponseEntity.ok(questionnaireService.save(q));
    }

    // EMF submits answers
    @PostMapping("/{id}/answers")
    @PreAuthorize("hasRole('EMF')")
    public ResponseEntity<QuestionnaireAnswer> submitAnswers(
            @PathVariable Long id,
            @RequestBody String jsonAnswers,
            @AuthenticationPrincipal Utilisateur user
    ) {
        var questionnaire = questionnaireService.getById(id);
        if (questionnaire.isEmpty()) return ResponseEntity.notFound().build();
        if (user != null && questionnaireAnswerRepository.existsByQuestionnaire_IdAndEmfUser_Idutilisateur(id, user.getIdutilisateur())) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        QuestionnaireAnswer ans = new QuestionnaireAnswer();
        ans.setQuestionnaire(questionnaire.get());
        ans.setEmfUser(user);
        ans.setJsonAnswers(jsonAnswers);
        ans.setSubmittedAt(LocalDateTime.now());
        QuestionnaireAnswer saved = questionnaireAnswerRepository.save(ans);
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }

    // EMF can check if already answered
    @GetMapping("/{id}/answeredByMe")
    @PreAuthorize("hasRole('EMF')")
    public ResponseEntity<Boolean> answeredByMe(@PathVariable Long id, @AuthenticationPrincipal Utilisateur user) {
        if (user == null) return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        boolean exists = questionnaireAnswerRepository.existsByQuestionnaire_IdAndEmfUser_Idutilisateur(id, user.getIdutilisateur());
        return ResponseEntity.ok(exists);
    }

    // CNEF/PASNFI can list answers for aggregation
    @GetMapping("/{id}/answers")
    @PreAuthorize("hasRole('CNEF') or hasRole('ADMIN')")
    public ResponseEntity<java.util.List<QuestionnaireAnswer>> listAnswers(@PathVariable Long id) {
        // optionally validate questionnaire exists
        if (questionnaireRepository.existsById(id)) {
            return ResponseEntity.ok(questionnaireAnswerRepository.findByQuestionnaire_Id(id));
        }
        return ResponseEntity.notFound().build();
    }
}
