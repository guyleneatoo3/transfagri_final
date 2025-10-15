package com.example.TRANSFAGRI.Package;

public class AuthResponse {
    private String token;
    private String email;
    private String role;

    // constructeur
    public AuthResponse(String token, String email, String role) {
        this.token = token;
        this.email = email;
        this.role = role;
    }

    // Getters & Setters
}
