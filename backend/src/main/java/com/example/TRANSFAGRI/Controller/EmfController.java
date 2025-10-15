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
@CrossOrigin(origins = "http://localhost:4200")
public class EmfController {

    @Autowired
    private EmfService emfService;

    @Autowired
    private UtilisateurService utilisateurService;

    @PostMapping("/{emfId}/utilisateurs/{userId}")
    public ResponseEntity<EMF> addUtilisateurToEmf(@PathVariable Long emfId, @PathVariable Long userId) {
        EMF emf = emfService.addUtilisateur(emfId, userId);
        return new ResponseEntity<>(emf, HttpStatus.OK);
    }

    @GetMapping("/{emfId}/utilisateurs")
    public ResponseEntity<List<Utilisateur>> getUtilisateursOfEmf(@PathVariable Long emfId) {
        List<Utilisateur> utilisateurs = emfService.getUtilisateurs(emfId);
        return new ResponseEntity<>(utilisateurs, HttpStatus.OK);
    }

    // Dissocier un utilisateur d'un EMF
    @DeleteMapping("/{emfId}/utilisateurs/{userId}")
    public ResponseEntity<Void> removeUtilisateurFromEmf(@PathVariable Long emfId, @PathVariable Long userId) {
        emfService.removeUtilisateur(emfId, userId);
        return ResponseEntity.noContent().build();
    }
}