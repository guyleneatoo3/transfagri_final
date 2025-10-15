package com.example.TRANSFAGRI.Repository;

import com.example.TRANSFAGRI.Model.Rapport;
import com.example.TRANSFAGRI.Model.SuperAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.Optional;

@Repository
public interface RapportRepository extends JpaRepository<Rapport, Integer> {
    Optional<Rapport> findByIdRapport(Integer idRapport);
    Optional<Rapport> findByContenu(String contenu);
    Optional<Rapport> findByDateDebut(Date dateDebut);
    Optional<Rapport> findByDateFin(Date dateFin);
    Optional<Rapport> findByIdEvaluation(Integer idEvaluation);

}
