package com.example.TRANSFAGRI.Repository;

import com.example.TRANSFAGRI.Model.UploadedFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UploadedFileRepository extends JpaRepository<UploadedFile, Long> {
}
