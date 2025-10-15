package com.example.TRANSFAGRI.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CnefDto {
    private Integer idCNEF;
    private String nom;
    private String email;
    private String telephone;
}
