package com.example.TRANSFAGRI.Repository;

import com.example.TRANSFAGRI.Model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Déclaration correcte de l'interface
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByEmail(String email);
    Optional<Utilisateur> findByNom(String nom);
    Optional<Utilisateur> findByMotdepasse(String motdepasse);

}

