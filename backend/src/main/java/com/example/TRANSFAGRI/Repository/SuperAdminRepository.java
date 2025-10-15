package com.example.TRANSFAGRI.Repository;

import com.example.TRANSFAGRI.Model.SuperAdmin;
import com.example.TRANSFAGRI.Model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SuperAdminRepository extends JpaRepository<SuperAdmin, Integer> {
    Optional<SuperAdmin> findByIdSuperAdmin(Integer idSuperAdmin);
    Optional<SuperAdmin> findByNom(String nom);
    Optional<SuperAdmin> findByEmail(String email);
}
