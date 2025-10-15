package com.example.TRANSFAGRI.Repository;

import com.example.TRANSFAGRI.Model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.Optional;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Integer> {
    Optional<Evaluation>findByIdEvaluation(Integer idEvaluation);
    Optional<Evaluation>findByDate(Date Date);
    Optional<Evaluation>findByScore(Integer score);

    Optional<Evaluation>findByCommentaire(String commentairee);
}
