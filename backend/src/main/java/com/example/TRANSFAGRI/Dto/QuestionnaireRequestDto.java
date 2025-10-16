package com.example.TRANSFAGRI.Dto;

public class QuestionnaireRequestDto {
    private String description;
    private String titre;
    private String type;

    public QuestionnaireRequestDto() {}

    public QuestionnaireRequestDto(String description, String titre, String type) {
        this.description = description;
        this.titre = titre;
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
