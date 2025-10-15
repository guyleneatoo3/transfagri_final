package com.example.TRANSFAGRI.Model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "utilisateur")
public class Utilisateur implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idutilisateur;

    private String nom;
    private String email;
    private String motdepasse;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role != null ? role.getAuthorities() : null;
    }

    @Override
    public String getPassword() {
        return motdepasse;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    // Getters explicites pour compatibilité
    public Long getIdutilisateur() { return idutilisateur; }
    public String getEmail() { return email; }
    public String getMotdepasse() { return motdepasse; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public void setNom(String nom) { this.nom = nom; }
}
