package com.example.TRANSFAGRI.Repository;


import com.example.TRANSFAGRI.Model.Activite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActiviteRepository extends JpaRepository<Activite, Long> {
}
