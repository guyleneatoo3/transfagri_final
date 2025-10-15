package com.example.TRANSFAGRI.Controller;

import com.example.TRANSFAGRI.dto.QuestionnaireRequestDto;
import com.example.TRANSFAGRI.Model.Question;
import com.example.TRANSFAGRI.Model.Questionnaire;
import com.example.TRANSFAGRI.Service.MistralApiService;
import com.example.TRANSFAGRI.Service.QuestionnaireService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/questionnaires")
public class QuestionnaireController {
    @Autowired
    private MistralApiService mistralApiService;
    @Autowired
    private QuestionnaireService questionnaireService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/generate")
    @PreAuthorize("hasRole('CNEF')")
    public ResponseEntity<Questionnaire> generateQuestionnaire(@RequestBody QuestionnaireRequestDto dto) {
        List<Question> questions = mistralApiService.generateQuestionnaire(dto.getDescription());
        Questionnaire questionnaire = new Questionnaire();
        questionnaire.setTitre(dto.getTitre());
        questionnaire.setDescription(dto.getDescription());
        questionnaire.setCreatedAt(LocalDateTime.now());
        try {
            questionnaire.setQuestions(questions);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Questionnaire saved = questionnaireService.save(questionnaire);
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }
}
