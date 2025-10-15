package com.example.TRANSFAGRI.Service;

import com.example.TRANSFAGRI.Model.Activite;
import java.util.List;

public interface ActiviteService {
    List<Activite> getAll();
    Activite getById(Long id);
    Activite save(Activite activite);
    void delete(Long id);
}
