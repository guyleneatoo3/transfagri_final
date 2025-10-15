package com.example.TRANSFAGRI.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IndicateurDto {
    private Integer id;
    private String nom;
    private String description;
}
