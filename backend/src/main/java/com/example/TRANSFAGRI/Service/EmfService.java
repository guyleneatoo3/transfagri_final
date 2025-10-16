package com.example.TRANSFAGRI.Service;

import com.example.TRANSFAGRI.Model.EMF;
import com.example.TRANSFAGRI.Model.Utilisateur;
import com.example.TRANSFAGRI.Repository.EmfRepository;
import com.example.TRANSFAGRI.Repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * Ce service contient la logique métier pour la gestion des EMF.
 * Il utilise le repository pour interagir avec la base de données.
 */
@Service
public abstract class EmfService {

    @Autowired
    private EmfRepository emfRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;
    // Associer un utilisateur à un EMF
    public EMF addUtilisateur(Long emfId, Long userId) {
        EMF emf = emfRepository.findById(emfId).orElseThrow(() -> new RuntimeException("EMF non trouvé"));
        Utilisateur utilisateur = utilisateurRepository.findById(userId).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        if (emf.getUtilisateurs() == null) {
            emf.setUtilisateurs(new java.util.ArrayList<>());
        }
        emf.getUtilisateurs().add(utilisateur);
        return emfRepository.save(emf);
    }

    // Récupérer les utilisateurs d'un EMF
    public List<Utilisateur> getUtilisateurs(Long emfId) {
        EMF emf = emfRepository.findById(emfId).orElseThrow(() -> new RuntimeException("EMF non trouvé"));
        return emf.getUtilisateurs();
    }

    // Dissocier un utilisateur d'un EMF
    public void removeUtilisateur(Long emfId, Long userId) {
        EMF emf = emfRepository.findById(emfId).orElseThrow(() -> new RuntimeException("EMF non trouvé"));
        if (emf.getUtilisateurs() != null) {
              emf.getUtilisateurs().removeIf(u -> u.getIdutilisateur().equals(userId));
            emfRepository.save(emf);
        }
    }

    public EMF saveEmf(EMF emf) {
        return emfRepository.save(emf);
    }

    public List<EMF> getAllEmfs() {
        return emfRepository.findAll();
    }

    public long countEmfs() {
        return emfRepository.count();
    }

    public Optional<EMF> getEmfById(Long id) {
        return emfRepository.findById(id);
    }

    public void deleteEmf(Long id) {
        emfRepository.deleteById(id);
    }

    public EMF updateEmf(Long id, EMF updatedEmf) {
        return emfRepository.findById(id)
                .map(emf -> {
                    emf.setDenomination(updatedEmf.getDenomination());
                    emf.setLocalisation(updatedEmf.getLocalisation());
                    emf.setDirigeant(updatedEmf.getDirigeant());
                    emf.setNumeroDAgrement(updatedEmf.getNumeroDAgrement());
                    emf.setNumeroCNC(updatedEmf.getNumeroCNC());
                    emf.setEmail(updatedEmf.getEmail());
                    return emfRepository.save(emf);
                })
                .orElseGet(() -> {
                    updatedEmf.setId(id);
                    return emfRepository.save(updatedEmf);
                });
    }

    public List<EMF> searchEmfs(String searchTerm) {
        if (searchTerm == null || searchTerm.isBlank()) {
            return emfRepository.findAll();
        }
        return emfRepository.findByDenominationContainingIgnoreCaseOrLocalisationContainingIgnoreCaseOrDirigeantContainingIgnoreCase(
                searchTerm, searchTerm, searchTerm
        );
    }

    public abstract EMF creerEmf(EMF emf);

    public abstract List<EMF> listerEmfs();

    public abstract Optional<EMF> obtenirEmfParId(Long id);

    public abstract EMF modifierEmf(Long id, EMF emfDetails);

    public abstract void supprimerEmf(Long id);
}
