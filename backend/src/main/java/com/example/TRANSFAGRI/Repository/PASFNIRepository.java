package com.example.TRANSFAGRI.Repository;

import com.example.TRANSFAGRI.Model.PASFNI;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PASFNIRepository extends JpaRepository<PASFNI, Integer> {
    Optional<PASFNI>findByIdPASFNI(Integer idPASFNI );
}
