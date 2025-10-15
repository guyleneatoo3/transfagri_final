package com.example.TRANSFAGRI.auth;

import com.example.TRANSFAGRI.Model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String email;
    private String motdepasse;
    private Role role;
}
