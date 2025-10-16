package com.example.TRANSFAGRI.Repository;

import com.example.TRANSFAGRI.Model.Questionnaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionnaireRepository extends JpaRepository<Questionnaire, Long> {
	List<Questionnaire> findBySharedTrue();
}
