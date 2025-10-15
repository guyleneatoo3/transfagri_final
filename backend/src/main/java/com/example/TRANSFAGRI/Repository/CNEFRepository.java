package com.example.TRANSFAGRI.Repository;

import com.example.TRANSFAGRI.Model.CNEF;
import com.example.TRANSFAGRI.Model.EMF;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CNEFRepository extends JpaRepository<CNEF, Integer> {
    Optional<CNEF> findByIdCNEF(Integer idCNEF);
}
