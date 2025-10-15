package com.example.TRANSFAGRI.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProjetDto {
    private Integer idProjet;
    private String nom;
    private String description;
    private Date dateDebut;
    private Date dateFin;
    private String etat;
    private Integer indicateurId;

   
}
