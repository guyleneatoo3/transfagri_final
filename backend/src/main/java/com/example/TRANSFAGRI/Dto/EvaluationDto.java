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
public class EvaluationDto {
    private Integer idEvaluation;
    private Date date;
    private Integer score;
    private String commentaire;

    // Relation simplifiée : soit on expose tout l'objet indicateurDto,
    // soit juste son id pour alléger
    private IndicateurDto indicateur;
}
