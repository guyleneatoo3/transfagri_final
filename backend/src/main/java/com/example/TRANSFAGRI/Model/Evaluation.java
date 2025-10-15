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

public class Evaluation {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)//l'identifiant est auto increment
    private Integer idEvaluation;
    private Date date;
    private Integer score;
    private String commentaire ;
    @ManyToOne
    @JoinColumn(name="indicateur" ,referencedColumnName = "id",nullable = false,unique = false)
    private Indicateur indicateur;
}
