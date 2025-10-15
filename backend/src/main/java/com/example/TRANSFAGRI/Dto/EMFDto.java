package com.example.TRANSFAGRI.dto;

import lombok.Data;
import java.util.List;

@Data
public class EMFDto {
    private Long id;
    private String denomination;
    private String localisation;
    private String dirigeant;
    private String numeroDAgrement;
    private String numeroCNC;
    private String email;

    // tu peux inclure les utilisateurs si besoin
    private List<UtilisateurDto> utilisateurs;
}
