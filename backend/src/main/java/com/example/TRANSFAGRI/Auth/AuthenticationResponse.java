package com.example.TRANSFAGRI.auth;

import com.example.TRANSFAGRI.Model.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class AuthenticationResponse {
    private String token;
    private String name;
    @Enumerated(EnumType.STRING)
    private Role role;

}
