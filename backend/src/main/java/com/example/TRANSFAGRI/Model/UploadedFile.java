package com.example.TRANSFAGRI.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Entity
public class UploadedFile {

    // Getters and setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private String fileName;

    @Setter
    private String filePath;

    @Setter
    private LocalDateTime uploadDate;

    // Constructors
    public UploadedFile() {}

    public UploadedFile(String fileName, String filePath, LocalDateTime uploadDate) {
        this.fileName = fileName;
        this.filePath = filePath;
        this.uploadDate = uploadDate;
    }

    public String getFileName() {
        return fileName;
    }
}
