package com.example.TRANSFAGRI.Controller;// ...existing imports...
import com.example.TRANSFAGRI.Model.EMF;
import com.example.TRANSFAGRI.Model.Utilisateur;
import com.example.TRANSFAGRI.Service.EmfService;
import com.example.TRANSFAGRI.Service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emfs")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class EmfController {

    @Autowired
    private EmfService emfService;

    @Autowired
    private UtilisateurService utilisateurService;

    // GET /api/emfs?search=term
    @GetMapping
    public ResponseEntity<List<EMF>> list(@RequestParam(value = "search", required = false) String search) {
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(emfService.searchEmfs(search));
        }
        return ResponseEntity.ok(emfService.getAllEmfs());
    }

    // GET /api/emfs/count (public for KPI)
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(emfService.countEmfs());
    }

    // POST /api/emfs
    @PostMapping
    public ResponseEntity<EMF> create(@RequestBody EMF emf) {
        EMF created = emfService.saveEmf(emf);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // GET /api/emfs/{id}
    @GetMapping("/{id}")
    public ResponseEntity<EMF> getById(@PathVariable Long id) {
        return emfService.getEmfById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /api/emfs/{id}
    @PutMapping("/{id}")
    public ResponseEntity<EMF> update(@PathVariable Long id, @RequestBody EMF emf) {
        EMF updated = emfService.updateEmf(id, emf);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/emfs/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        emfService.deleteEmf(id);
        return ResponseEntity.noContent().build();
    }

    // POST /api/emfs/{emfId}/utilisateurs/{userId}
    @PostMapping("/{emfId}/utilisateurs/{userId}")
    public ResponseEntity<EMF> addUtilisateurToEmf(@PathVariable Long emfId, @PathVariable Long userId) {
        EMF emf = emfService.addUtilisateur(emfId, userId);
        return new ResponseEntity<>(emf, HttpStatus.OK);
    }

    // GET /api/emfs/{emfId}/utilisateurs
    @GetMapping("/{emfId}/utilisateurs")
    public ResponseEntity<List<Utilisateur>> getUtilisateursOfEmf(@PathVariable Long emfId) {
        List<Utilisateur> utilisateurs = emfService.getUtilisateurs(emfId);
        return new ResponseEntity<>(utilisateurs, HttpStatus.OK);
    }

    // DELETE /api/emfs/{emfId}/utilisateurs/{userId}
    @DeleteMapping("/{emfId}/utilisateurs/{userId}")
    public ResponseEntity<Void> removeUtilisateurFromEmf(@PathVariable Long emfId, @PathVariable Long userId) {
        emfService.removeUtilisateur(emfId, userId);
        return ResponseEntity.noContent().build();
    }
}
