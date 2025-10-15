package com.example.TRANSFAGRI.Service;

import com.example.TRANSFAGRI.Model.Question;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

public class QuestionParser {
    public static List<Question> parseQuestions(String json) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(json, new TypeReference<List<Question>>(){});
        } catch (Exception e) {
            // fallback: return empty list
            return new ArrayList<>();
        }
    }
}
