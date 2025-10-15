package com.example.TRANSFAGRI.Controller;

import com.example.TRANSFAGRI.Model.Activite;
import com.example.TRANSFAGRI.Service.ActiviteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activites")
@CrossOrigin(origins = "*")
public class ActiviteController {
    @Autowired
    private ActiviteService activiteService;

    @GetMapping
    public List<Activite> getAll() {
        return activiteService.getAll();
    }

    @GetMapping("/{id}")
    public Activite getById(@PathVariable Long id) {
        return activiteService.getById(id);
    }

    @PostMapping
    public Activite create(@RequestBody Activite activite) {
        return activiteService.save(activite);
    }

    @PutMapping("/{id}")
    public Activite update(@PathVariable Long id, @RequestBody Activite activite) {
        activite.setId(id);
        return activiteService.save(activite);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        activiteService.delete(id);
    }
}
