package com.example.TRANSFAGRI.Service;

import com.example.TRANSFAGRI.Model.Question;
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
    public List<Question> generateQuestionnaire(String description) {
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

        String body = "{" +
                "\"model\": \"mistral-large-latest\"," +
                "\"messages\": [{\"role\": \"user\", \"content\": " +
                "\"" + prompt.replace("\"", "\\\"") + "\"}]," +
                "\"temperature\": 0.7" +
                "}";

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            logger.info("Mistral API response: {}", response.getBody());

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map choices = ((List<Map>) response.getBody().get("choices")).get(0);
                Map message = (Map) choices.get("message");
                String content = (String) message.get("content");

                // Conversion en objets Question (via ton parser)
                return QuestionParser.parseQuestions(content);
            }
        } catch (Exception e) {
            logger.error("Erreur lors de l'appel à l'API Mistral", e);
        }

        return new ArrayList<>();
    }
}
