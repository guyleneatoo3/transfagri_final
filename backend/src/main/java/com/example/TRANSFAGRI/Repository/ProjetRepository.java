package com.example.TRANSFAGRI.Repository;

import com.example.TRANSFAGRI.Model.Projet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.Optional;

@Repository
public interface ProjetRepository extends JpaRepository<Projet, Integer> {
    Optional<Projet> findByIdProjet(Integer idProjet);
    Optional<Projet> findByNom(String nom);
    Optional<Projet> findByDescription(String description);
    Optional<Projet> findByDateDebut(Date dateDebut);
    Optional<Projet> findByDateFin(Date dateFin);
    Optional<Projet> findByEtat(String etat);

}
