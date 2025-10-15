package com.example.TRANSFAGRI.Service;

import com.example.TRANSFAGRI.Model.EMF;
import com.example.TRANSFAGRI.Repository.EmfRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmfServiceImpl extends EmfService {

    @Autowired
    private EmfRepository emfRepository;

    @Override
    public EMF creerEmf(EMF emf) {
        return emfRepository.save(emf);
    }

    @Override
    public List<EMF> listerEmfs() {
        return emfRepository.findAll();
    }

    @Override
    public Optional<EMF> obtenirEmfParId(Long id) {
        return emfRepository.findById(id);
    }

    @Override
    public EMF modifierEmf(Long id, EMF emfDetails) {
        EMF existing = emfRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EMF non trouvé avec id = " + id));

        // Mettre à jour les champs
        existing.setDenomination(emfDetails.getDenomination());
        existing.setLocalisation(emfDetails.getLocalisation());
        existing.setDirigeant(emfDetails.getDirigeant());
        existing.setNumeroDAgrement(emfDetails.getNumeroDAgrement());
        existing.setNumeroCNC(emfDetails.getNumeroCNC());
        existing.setEmail(emfDetails.getEmail());

        return emfRepository.save(existing);
    }

    @Override
    public void supprimerEmf(Long id) {
        EMF existing = emfRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EMF non trouvé avec id = " + id));
        emfRepository.delete(existing);
    }
}
