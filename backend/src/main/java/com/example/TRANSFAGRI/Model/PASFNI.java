package com.example.TRANSFAGRI.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity//pour génerer des tables
@Data//
@AllArgsConstructor//
@NoArgsConstructor
@Builder//
public class PASFNI {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)//l'identifiant est auto increment
    private Integer idPASFNI;
}
