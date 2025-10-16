package com.example.TRANSFAGRI.Repository;

import com.example.TRANSFAGRI.Model.Report;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
	Optional<Report> findByQuestionnaire_Id(Long questionnaireId);

	// Returns all reports for a questionnaire (for deduplication)
	List<Report> findAllByQuestionnaire_Id(Long questionnaireId);

	// Returns the most recently generated report for a questionnaire (preferred)
	Optional<Report> findFirstByQuestionnaire_IdOrderByGeneratedAtDesc(Long questionnaireId);
}
