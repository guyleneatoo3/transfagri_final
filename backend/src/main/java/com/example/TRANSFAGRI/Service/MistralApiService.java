package com.example.TRANSFAGRI.Service;

import com.example.TRANSFAGRI.Dto.QuestionGenerationResponse;

public interface MistralApiService {
    QuestionGenerationResponse generateQuestionnaire(String description);
}
