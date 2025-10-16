package com.example.TRANSFAGRI.Service;

import com.example.TRANSFAGRI.Model.Question;
import com.example.TRANSFAGRI.Dto.QuestionGenerationResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class MistralApiServiceImpl implements MistralApiService {
    private static final Logger logger = LoggerFactory.getLogger(MistralApiServiceImpl.class);

    @Value("${mistral.api.key}")
    private String mistralApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public QuestionGenerationResponse generateQuestionnaire(String description) {
        String url = "https://api.mistral.ai/v1/chat/completions";
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));
    headers.setBearerAuth(mistralApiKey);

        String prompt = String.format(
                "Génère un questionnaire d'évaluation pour un EMF concernant l’objectif suivant : '%s'. "
                        + "Le questionnaire doit contenir 5 à 10 questions avec différents types de réponse : "
                        + "choix multiple, texte libre, échelle de satisfaction.",
                description
        );

        // Build body with Jackson to ensure proper escaping
        ObjectNode root = objectMapper.createObjectNode();
        root.put("model", "mistral-tiny");
        ObjectNode responseFormat = objectMapper.createObjectNode();
        responseFormat.put("type", "json_object");
        root.set("response_format", responseFormat);
    ArrayNode messages = objectMapper.createArrayNode();
    ObjectNode userMsg = objectMapper.createObjectNode();
    userMsg.put("role", "user");
    userMsg.put("content", prompt);
    messages.add(userMsg);
        root.set("messages", messages);
        root.put("temperature", 0.2);

        String body = root.toString();
        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.POST, entity, Object.class);
            logger.info("Mistral API response: {}", response.getBody());

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() instanceof Map<?,?> map) {
                Object choicesObj = map.get("choices");
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

        // Fallback minimal questionnaire when API fails or returns no content
        logger.warn("Mistral API did not return usable content — returning fallback questionnaire.");
        List<Question> fallback = new ArrayList<>();
        fallback.add(new Question("Quel est l'effectif total formé en 2025 ?", "number", null));
        fallback.add(new Question("Donnez un exemple d'amélioration observée.", "text", null));
        String fallbackJson = "{ \"questions\": [ { \"question\": \"Quel est l'effectif total formé en 2025 ?\", \"type\": \"number\" }, { \"question\": \"Donnez un exemple d'amélioration observée.\", \"type\": \"text\" } ] }";
        return new QuestionGenerationResponse(fallback, fallbackJson);
    }

    @Override
    public String summarize(String prompt) {
    String url = "https://api.mistral.ai/v1/chat/completions";
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));
    headers.setBearerAuth(mistralApiKey);

    ObjectNode root = objectMapper.createObjectNode();
    root.put("model", "mistral-tiny");
    ArrayNode messages = objectMapper.createArrayNode();
    ObjectNode userMsg = objectMapper.createObjectNode();
    userMsg.put("role", "user");
    userMsg.put("content", prompt);
    messages.add(userMsg);
    root.set("messages", messages);
    root.put("temperature", 0.2);

    String body = root.toString();
    HttpEntity<String> entity = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.POST, entity, Object.class);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() instanceof Map<?,?> respMap) {
                Object choicesObj = respMap.get("choices");
                if (choicesObj instanceof List<?> list && !list.isEmpty()) {
                    Object first = list.get(0);
                    if (first instanceof Map<?,?> m) {
                        Object msg = m.get("message");
                        if (msg instanceof Map<?,?> m2) {
                            Object c = m2.get("content");
                            if (c instanceof String s) return s;
                        }
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Erreur lors de la génération du résumé Mistral", e);
        }
        return "Résumé automatique indisponible pour le moment.";
    }
}
