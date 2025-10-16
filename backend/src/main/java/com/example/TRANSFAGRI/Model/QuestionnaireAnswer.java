package com.example.TRANSFAGRI.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class QuestionnaireAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "questionnaire_id")
    private Questionnaire questionnaire;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emf_user_id")
    private Utilisateur emfUser;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String jsonAnswers;

    private LocalDateTime submittedAt;

    public QuestionnaireAnswer() {}

    public QuestionnaireAnswer(Questionnaire questionnaire, Utilisateur emfUser, String jsonAnswers, LocalDateTime submittedAt) {
        this.questionnaire = questionnaire;
        this.emfUser = emfUser;
        this.jsonAnswers = jsonAnswers;
        this.submittedAt = submittedAt;
    }

    public Long getId() { return id; }
    public Questionnaire getQuestionnaire() { return questionnaire; }
    public void setQuestionnaire(Questionnaire questionnaire) { this.questionnaire = questionnaire; }
    public Utilisateur getEmfUser() { return emfUser; }
    public void setEmfUser(Utilisateur emfUser) { this.emfUser = emfUser; }
    public String getJsonAnswers() { return jsonAnswers; }
    public void setJsonAnswers(String jsonAnswers) { this.jsonAnswers = jsonAnswers; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
