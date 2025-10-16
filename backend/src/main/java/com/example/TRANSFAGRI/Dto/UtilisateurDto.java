package com.example.TRANSFAGRI.Dto;

import com.example.TRANSFAGRI.Dto.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UtilisateurDto {
    private Long id;
    private String nom;
    private String email;
    private String motdepasse;
    private Role role;

    public String getEmail() { return email; }
    public String getMotdepasse() { return motdepasse; }
    public Role getRole() { return role; }
    public String getNom() { return nom; }
}
