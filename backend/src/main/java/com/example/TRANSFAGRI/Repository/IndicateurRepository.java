package com.example.TRANSFAGRI.Repository;

import com.example.TRANSFAGRI.Model.Indicateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Ce repository gère les opérations de base de données pour l'entité Indicateur.
 * Spring Data JPA fournit les méthodes CRUD automatiquement.
 */
@Repository
public interface IndicateurRepository extends JpaRepository<Indicateur, Long> {

    /**
     * Recherche des indicateurs dont le nom ou la description contient
     * une chaîne de caractères donnée, indépendamment de la casse.
     */
    List<Indicateur> findByNomContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String nom, String description);
}

