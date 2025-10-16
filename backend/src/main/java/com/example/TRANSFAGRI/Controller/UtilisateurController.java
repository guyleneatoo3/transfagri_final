package com.example.TRANSFAGRI.Controller;

import com.example.TRANSFAGRI.Model.Utilisateur;
import com.example.TRANSFAGRI.Dto.UtilisateurDto;
import com.example.TRANSFAGRI.Dto.UtilisateurResponse;
import com.example.TRANSFAGRI.Service.UtilisateurService;
//import io.swagger.annotations.Api;
//import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = "*", allowedHeaders = "*")
//@Api(value = "utilisateur Management System", description = "Operations pertaining to utilisateur in utilisateur Management System")
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;

  //  @ApiOperation(value = "View a list of available utilisateurs", response = List.class)
    @GetMapping
    public ResponseEntity<List<UtilisateurResponse>> getAllUtilisateurs() {
        List<UtilisateurResponse> responses = utilisateurService.getAllUtilisateurs();
        return ResponseEntity.ok(responses);
    }

    //@ApiOperation(value = "Get a utilisateur by Id")
    @GetMapping("/{idutilisateur}")
    public ResponseEntity<UtilisateurResponse> getUtilisateurById(@PathVariable("idutilisateur") Long id) {
        return utilisateurService.getUtilisateurById(id)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{idutilisateur}")
    public ResponseEntity<UtilisateurResponse> updateUtilisateur(@PathVariable("idutilisateur") Long id, @RequestBody UtilisateurDto utilisateurDto) {
        Utilisateur updated = utilisateurService.updateUtilisateur(id, utilisateurDto);
        return ResponseEntity.ok(toResponse(updated));
    }
    private UtilisateurResponse toResponse(Utilisateur utilisateur) {
        UtilisateurResponse response = new UtilisateurResponse();
        response.setId(utilisateur.getIdutilisateur());
        response.setNom(utilisateur.getNom());
        response.setEmail(utilisateur.getEmail());
    response.setRole(utilisateur.getRole() != null ? utilisateur.getRole().toString() : null);
        return response;
    }

    //@ApiOperation(value = "Delete a utilisateur")
    @DeleteMapping("/{idutilisateur}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable("idutilisateur") Long id) {
        if (!utilisateurService.getUtilisateurById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        utilisateurService.deleteUtilisateurById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countUtilisateurs() {
        long count = utilisateurService.countUtilisateurs();
        return ResponseEntity.ok(count);
    }

}
