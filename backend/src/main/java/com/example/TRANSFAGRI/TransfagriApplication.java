package com.example.TRANSFAGRI;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.example.TRANSFAGRI.Model.Utilisateur;
import com.example.TRANSFAGRI.Model.Role;
import com.example.TRANSFAGRI.Repository.UtilisateurRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableJpaRepositories("com.example.TRANSFAGRI.Repository")
@EntityScan("com.example.TRANSFAGRI.Model")
public class TransfagriApplication {

    public static void main(String[] args) {
        SpringApplication.run(TransfagriApplication.class, args);
    }

    @Bean
    CommandLineRunner createFakeUsers(UtilisateurRepository utilisateurRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (utilisateurRepository.count() == 0) {
                utilisateurRepository.save(Utilisateur.builder()
                        .nom("Admin Principal")
                        .email("admin@demo.com")
                        .motdepasse(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .build());
                utilisateurRepository.save(Utilisateur.builder()
                        .nom("Cnef User")
                        .email("cnef@demo.com")
                        .motdepasse(passwordEncoder.encode("cnef123"))
                        .role(Role.CNEF)
                        .build());
                utilisateurRepository.save(Utilisateur.builder()
                        .nom("Emf User")
                        .email("emf@demo.com")
                        .motdepasse(passwordEncoder.encode("emf123"))
                        .role(Role.EMF)
                        .build());
                utilisateurRepository.save(Utilisateur.builder()
                        .nom("Inspecteur User")
                        .email("inspecteur@demo.com")
                        .motdepasse(passwordEncoder.encode("inspect123"))
                        .role(Role.INSPECTEUR)
                        .build());
            }
        };
    }
}
