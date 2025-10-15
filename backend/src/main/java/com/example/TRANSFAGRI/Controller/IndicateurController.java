package com.example.TRANSFAGRI.Controller;

import com.example.TRANSFAGRI.Model.Indicateur;
import com.example.TRANSFAGRI.Service.IndicateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/indicateurs")
@CrossOrigin(origins = "http://localhost:4200")
public class IndicateurController {

    @Autowired
    private IndicateurService indicateurService;

    @PostMapping
    public ResponseEntity<Indicateur> createIndicateur(@RequestBody Indicateur indicateur) {
        Indicateur savedIndicateur = indicateurService.saveIndicateur(indicateur);
        return new ResponseEntity<>(savedIndicateur, HttpStatus.CREATED);
    }
    
    @GetMapping
    public List<Indicateur> getAllIndicateurs(@RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) {
            return indicateurService.searchIndicateurs(search);
        }
        return indicateurService.getAllIndicateurs();
    }
    @PostMapping("/generer-questionnaire")
    public ResponseEntity<String> genererQuestionnairePourEMF(@RequestBody String description) {
        // Logique de génération de questionnaire.
        // C'est ici que vous devrez intégrer l'appel à l'API Mistral ou autre LLM.

        // Exemple de réponse simulée
        String questionnaireSimule = "Questionnaire généré basé sur la description : '" + description + "'.";

        return new ResponseEntity<>(questionnaireSimule, HttpStatus.OK);
    }
}