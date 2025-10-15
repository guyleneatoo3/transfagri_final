package com.example.TRANSFAGRI.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
@AllArgsConstructor
@NoArgsConstructor
@Entity//pour génere des tables
@Getter//pour ne plus avoir à ecrire les getters
@Setter//pour ne plus avoir à ecrire les setters

public class Projet {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)//l'identifiant est auto increment
    private Integer idProjet;
    private String nom;
    private String description;
    private Date dateDebut;
    private Date dateFin;
    private String etat;
    @OneToOne
    @JoinColumn(name="indicateur" ,referencedColumnName = "id",nullable = false,unique = false)
    private Indicateur indicateur;
}
