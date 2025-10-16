package com.example.TRANSFAGRI.Service;

import com.example.TRANSFAGRI.Model.Question;
import com.example.TRANSFAGRI.Dto.QuestionGenerationResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class MistralApiServiceImpl implements MistralApiService {
    private static final Logger logger = LoggerFactory.getLogger(MistralApiServiceImpl.class);

    @Value("${mistral.api.key}")
    private String mistralApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public QuestionGenerationResponse generateQuestionnaire(String description) {
        String url = "https://api.mistral.ai/v1/chat/completions";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(mistralApiKey);

        String prompt = String.format(
                "Génère un questionnaire d'évaluation pour un EMF concernant l’objectif suivant : '%s'. "
                        + "Le questionnaire doit contenir 5 à 10 questions avec différents types de réponse : "
                        + "choix multiple, texte libre, échelle de satisfaction.",
                description
        );

    // Request structured JSON suitable for QCM + QRO
    String body = "{" +
        "\"model\": \"mistral-tiny\"," +
        "\"response_format\": {\"type\": \"json_object\"}," +
        "\"messages\": [{\"role\": \"user\", \"content\": " +
        "\"" + prompt.replace("\"", "\\\"") + "\"}]," +
        "\"temperature\": 0.2" +
        "}";

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<java.util.Map<String, Object>> response = restTemplate.exchange(url, HttpMethod.POST, entity, (Class<java.util.Map<String, Object>>)(Class<?>)java.util.Map.class);
            logger.info("Mistral API response: {}", response.getBody());

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Object choicesObj = response.getBody().get("choices");
                String content = null;
                if (choicesObj instanceof java.util.List<?> list && !list.isEmpty()) {
                    Object first = list.get(0);
                    if (first instanceof java.util.Map<?,?> m) {
                        Object msg = m.get("message");
                        if (msg instanceof java.util.Map<?,?> m2) {
                            Object c = m2.get("content");
                            if (c instanceof String s) content = s;
                        }
                    }
                }
                if (content != null) {
                    java.util.List<Question> questions = QuestionParser.parseQuestions(content);
                    return new QuestionGenerationResponse(questions, content);
                }
            }
        } catch (Exception e) {
            logger.error("Erreur lors de l'appel à l'API Mistral", e);
        }

        return new QuestionGenerationResponse(new ArrayList<>(), null);
    }
}
