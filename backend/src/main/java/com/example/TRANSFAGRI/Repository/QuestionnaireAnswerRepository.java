package com.example.TRANSFAGRI.Repository;

import com.example.TRANSFAGRI.Model.QuestionnaireAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionnaireAnswerRepository extends JpaRepository<QuestionnaireAnswer, Long> {
    List<QuestionnaireAnswer> findByQuestionnaire_Id(Long questionnaireId);
    // Utilisateur primary key field is named 'idutilisateur', so reference it explicitly
    boolean existsByQuestionnaire_IdAndEmfUser_Idutilisateur(Long questionnaireId, Long emfUserId);
}
