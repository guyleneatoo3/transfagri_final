package com.example.TRANSFAGRI.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class QuestionnaireAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "questionnaire_id")
    @JsonIgnore // avoid serializing Hibernate proxy; expose questionnaireId instead
    private Questionnaire questionnaire;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emf_user_id")
    @JsonIgnore // avoid serializing Hibernate proxy; expose emfUserId instead
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

    // Lightweight identifiers for API consumers
    @JsonProperty("questionnaireId")
    public Long getQuestionnaireId() { return questionnaire != null ? questionnaire.getId() : null; }

    @JsonProperty("emfUserId")
    public Long getEmfUserId() { return emfUser != null ? emfUser.getIdutilisateur() : null; }
}
