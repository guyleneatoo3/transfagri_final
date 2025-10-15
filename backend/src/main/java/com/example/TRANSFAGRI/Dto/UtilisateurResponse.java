package com.example.TRANSFAGRI.dto;

import lombok.Data;
import lombok.Setter;

@Data
public class UtilisateurResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String role;

    public void setId(Long id) { this.id = id; }
    public void setNom(String nom) { this.nom = nom; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(String role) { this.role = role; }
}
