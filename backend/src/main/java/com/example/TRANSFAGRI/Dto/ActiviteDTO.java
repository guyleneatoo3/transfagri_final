package com.example.TRANSFAGRI.dto;

import lombok.Data;

@Data
public class ActiviteDTO {
    private Long id;
    private String nom;
    private String description;
    private String emfAssigne;
    private String statut;       // "Terminé", "En cours", "En retard"
    private String dateEcheance; // format: dd/MM/yyyy
}
