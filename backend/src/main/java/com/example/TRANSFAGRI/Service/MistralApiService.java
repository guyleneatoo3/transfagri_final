package com.example.TRANSFAGRI.Service;

import com.example.TRANSFAGRI.Dto.QuestionGenerationResponse;

public interface MistralApiService {
    QuestionGenerationResponse generateQuestionnaire(String description);
    /**
     * Generate a concise French summary from the given prompt/context.
     */
    String summarize(String prompt);
}
