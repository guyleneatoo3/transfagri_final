package com.example.TRANSFAGRI.Model;

import java.util.List;

import jakarta.persistence.Embeddable;

@Embeddable
public class Question {
    private String question;
    private String type;
    private List<Integer> scale;

    public Question() {}

    public Question(String question, String type, List<Integer> scale) {
        this.question = question;
        this.type = type;
        this.scale = scale;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<Integer> getScale() {
        return scale;
    }

    public void setScale(List<Integer> scale) {
        this.scale = scale;
    }
}
