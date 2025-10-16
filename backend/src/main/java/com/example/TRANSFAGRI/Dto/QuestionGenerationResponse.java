package com.example.TRANSFAGRI.Dto;

import com.example.TRANSFAGRI.Model.Question;
import java.util.List;

public class QuestionGenerationResponse {
    private List<Question> questions;
    private String jsonContent;

    public QuestionGenerationResponse() {}

    public QuestionGenerationResponse(List<Question> questions, String jsonContent) {
        this.questions = questions;
        this.jsonContent = jsonContent;
    }

    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) { this.questions = questions; }
    public String getJsonContent() { return jsonContent; }
    public void setJsonContent(String jsonContent) { this.jsonContent = jsonContent; }
}
