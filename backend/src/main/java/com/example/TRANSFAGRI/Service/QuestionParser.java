package com.example.TRANSFAGRI.Service;

import com.example.TRANSFAGRI.Model.Question;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class QuestionParser {
    public static List<Question> parseQuestions(String json) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            // Try array directly
            if (json != null && json.trim().startsWith("[")) {
                return mapper.readValue(json, new TypeReference<List<Question>>(){});
            }
            // Else try object with 'questions'
            Map<String, Object> obj = mapper.readValue(json, new TypeReference<Map<String, Object>>(){});
            Object q = obj.get("questions");
            if (q != null) {
                String arr = mapper.writeValueAsString(q);
                return mapper.readValue(arr, new TypeReference<List<Question>>(){});
            }
        } catch (Exception e) {
            // fallback: return empty list
            return new ArrayList<>();
        }
        return new ArrayList<>();
    }
}
