package com.example.TRANSFAGRI.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UploadedFileDto {
    private Long id;
    private String fileName;
    private String filePath;
    private LocalDateTime uploadDate;
}
