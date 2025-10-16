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
        Utilisateur admin = new Utilisateur();
        admin.setNom("Admin Principal");
        admin.setEmail("admin@demo.com");
        admin.setMotdepasse(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        utilisateurRepository.save(admin);

        Utilisateur cnef = new Utilisateur();
        cnef.setNom("Cnef User");
        cnef.setEmail("cnef@demo.com");
        cnef.setMotdepasse(passwordEncoder.encode("cnef123"));
        cnef.setRole(Role.CNEF);
        utilisateurRepository.save(cnef);

        Utilisateur emf = new Utilisateur();
        emf.setNom("Emf User");
        emf.setEmail("emf@demo.com");
        emf.setMotdepasse(passwordEncoder.encode("emf123"));
        emf.setRole(Role.EMF);
        utilisateurRepository.save(emf);
        // Removed INSPECTEUR seeding as the role is no longer used
            }
        };
    }
}
