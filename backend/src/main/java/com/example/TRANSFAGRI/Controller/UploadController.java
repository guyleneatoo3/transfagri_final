package com.example.TRANSFAGRI.Controller;

import com.example.TRANSFAGRI.Model.UploadedFile;
import com.example.TRANSFAGRI.Service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/Upload")
@CrossOrigin(origins = "http://localhost:4200") 
public class UploadController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            UploadedFile savedFile = fileStorageService.storeFile(file);
            return ResponseEntity.ok("✅ Fichier " + savedFile.getFileName() + " téléversé avec succès !");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("❌ " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("❌ Erreur : " + e.getMessage());
        }
    }
}
