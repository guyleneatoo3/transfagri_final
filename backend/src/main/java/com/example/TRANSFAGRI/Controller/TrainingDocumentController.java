package com.example.TRANSFAGRI.Controller;

import com.example.TRANSFAGRI.Model.TrainingDocument;
import com.example.TRANSFAGRI.Repository.TrainingDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/training-docs")
public class TrainingDocumentController {
    @Autowired private TrainingDocumentRepository repo;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CNEF')")
    public ResponseEntity<TrainingDocument> upload(@RequestParam("file") MultipartFile file, @RequestParam("title") String title) throws Exception {
        TrainingDocument doc = new TrainingDocument();
        doc.setTitle(title);
        doc.setFileName(file.getOriginalFilename());
        doc.setContentType(file.getContentType());
        doc.setData(file.getBytes());
        doc.setUploadedAt(LocalDateTime.now());
        return ResponseEntity.ok(repo.save(doc));
    }

    @GetMapping
    public ResponseEntity<java.util.List<TrainingDocument>> list() {
        return ResponseEntity.ok(repo.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        return repo.findById(id)
                .map(doc -> ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getFileName() + "\"")
                        .contentType(MediaType.parseMediaType(doc.getContentType() != null ? doc.getContentType() : MediaType.APPLICATION_PDF_VALUE))
                        .body(doc.getData()))
                .orElse(ResponseEntity.notFound().build());
    }
}
