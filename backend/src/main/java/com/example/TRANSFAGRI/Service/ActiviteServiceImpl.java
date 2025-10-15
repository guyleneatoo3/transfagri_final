package com.example.TRANSFAGRI.Service;

import com.example.TRANSFAGRI.Model.Activite;
import com.example.TRANSFAGRI.Repository.ActiviteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ActiviteServiceImpl implements ActiviteService {
    @Autowired
    private ActiviteRepository activiteRepository;

    @Override
    public List<Activite> getAll() {
        return activiteRepository.findAll();
    }

    @Override
    public Activite getById(Long id) {
        return activiteRepository.findById(id).orElse(null);
    }

    @Override
    public Activite save(Activite activite) {
        return activiteRepository.save(activite);
    }

    @Override
    public void delete(Long id) {
        activiteRepository.deleteById(id);
    }
}
