package com.example.TRANSFAGRI.Service;

import com.example.TRANSFAGRI.Model.Indicateur;
import com.example.TRANSFAGRI.Repository.IndicateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

public interface IndicateurService {
    Indicateur saveIndicateur(Indicateur indicateur);
    List<Indicateur> getAllIndicateurs();
    long countIndicateurs();
    Optional<Indicateur> getIndicateurById(Long id);
    void deleteIndicateur(Long id);
    Indicateur updateIndicateur(Long id, Indicateur updatedIndicateur);
    List<Indicateur> searchIndicateurs(String searchTerm);
}
