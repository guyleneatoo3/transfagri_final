package com.example.TRANSFAGRI.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @ManyToOne
    @JoinColumn(name = "questionnaire_id")
    private Questionnaire questionnaire;

    private LocalDateTime generatedAt;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String contentJson; // Aggregated JSON summary

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String aiSummary; // Optional: AI-generated textual summary

    public Report() {}

    public Report(String title, Questionnaire questionnaire, LocalDateTime generatedAt, String contentJson) {
        this.title = title;
        this.questionnaire = questionnaire;
        this.generatedAt = generatedAt;
        this.contentJson = contentJson;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Questionnaire getQuestionnaire() { return questionnaire; }
    public void setQuestionnaire(Questionnaire questionnaire) { this.questionnaire = questionnaire; }
    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
    public String getContentJson() { return contentJson; }
    public void setContentJson(String contentJson) { this.contentJson = contentJson; }

    public String getAiSummary() { return aiSummary; }
    public void setAiSummary(String aiSummary) { this.aiSummary = aiSummary; }
}
