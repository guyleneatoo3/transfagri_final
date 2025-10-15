package com.example.TRANSFAGRI.Service;

import com.example.TRANSFAGRI.Model.Question;

import java.util.List;

public interface MistralApiService {
    List<Question> generateQuestionnaire(String description);
}
