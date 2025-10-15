package com.example.TRANSFAGRI.Repository;

import com.example.TRANSFAGRI.Model.EMF;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface EmfRepository extends JpaRepository<EMF, Long> {
    List<EMF> findByDenominationContainingIgnoreCaseOrLocalisationContainingIgnoreCaseOrDirigeantContainingIgnoreCase(String denomination, String localisation, String dirigeant);
}
