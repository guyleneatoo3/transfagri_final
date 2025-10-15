package com.example.TRANSFAGRI.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Activite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String description;

    private String emfAssigne;
    private String statut; // "Terminé", "En cours", "En retard"

    private String dateEcheance; // format: dd/MM/yyyy
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getEmfAssigne() { return emfAssigne; }
    public void setEmfAssigne(String emfAssigne) { this.emfAssigne = emfAssigne; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public String getDateEcheance() { return dateEcheance; }
    public void setDateEcheance(String dateEcheance) { this.dateEcheance = dateEcheance; }
}
