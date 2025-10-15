package com.example.TRANSFAGRI.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Entity//pour génerer des tables
@Data//
@AllArgsConstructor//
@NoArgsConstructor
@Builder//
public class Rapport {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)//l'identifiant est auto increment
    private Integer idRapport;
    private String contenu;
    private Date dateDebut;
     private Date dateFin;
     private Integer idEvaluation;
    @OneToOne
    @JoinColumn(name="evaluation" ,referencedColumnName = "idEvaluation",nullable = false,unique = false)
    private Evaluation evaluation;
}
