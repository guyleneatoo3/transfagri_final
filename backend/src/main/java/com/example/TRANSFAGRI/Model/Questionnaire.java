package com.example.TRANSFAGRI.Model;


import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Questionnaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titre;
    private String description;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "questionnaire_questions", joinColumns = @JoinColumn(name = "questionnaire_id"))
    private List<Question> questions;
    private LocalDateTime createdAt;

    public Questionnaire() {}

    public Questionnaire(Long id, String titre, String description, List<Question> questions, LocalDateTime createdAt) {
        this.id = id;
        this.titre = titre;
        this.description = description;
        this.questions = questions;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
