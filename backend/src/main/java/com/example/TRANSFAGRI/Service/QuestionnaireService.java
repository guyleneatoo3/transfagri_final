package com.example.TRANSFAGRI.Service;

import com.example.TRANSFAGRI.Model.Questionnaire;

public interface QuestionnaireService {
    Questionnaire save(Questionnaire questionnaire);
    long count();
    java.util.List<Questionnaire> getAll();
    java.util.List<Questionnaire> getShared();
    java.util.Optional<Questionnaire> getById(Long id);
}
