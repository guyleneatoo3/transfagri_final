package com.example.TRANSFAGRI.Service;

import com.example.TRANSFAGRI.Model.UploadedFile;
import com.example.TRANSFAGRI.Repository.UploadedFileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private final UploadedFileRepository fileRepository;

    public FileStorageService(UploadedFileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    public UploadedFile storeFile(MultipartFile file) throws IOException {
        // Vérifier si le fichier est un PDF
        if (!file.getContentType().equals("application/pdf")) {
            throw new IllegalArgumentException("Seuls les fichiers PDF sont autorisés.");
        }

        // Générer un nom unique
        String originalFileName = file.getOriginalFilename();
        String fileName = UUID.randomUUID() + "_" + originalFileName;

        // Chemin complet
        String filePath = uploadDir + File.separator + fileName;

        // Sauvegarder le fichier sur le disque
        File dest = new File(filePath);
        file.transferTo(dest);

        // Enregistrer les métadonnées dans la DB
        UploadedFile uploadedFile = new UploadedFile(fileName, filePath, LocalDateTime.now());
        return (UploadedFile) fileRepository.save(uploadedFile);
    }
}
