package com.example.TRANSFAGRI.Configuration;
// Rename this file to JwtUtil.java

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import com.example.TRANSFAGRI.Model.Utilisateur;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;


@Component
public class JwtUtil {


    private final String secret = "ma-cle-secrete-256-bits-qui-doit-etre-tres-longue";
    private final Key key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));




    public String generateToken(Utilisateur utilisateur) {
        return Jwts.builder()
                .setSubject(utilisateur.getEmail())
                .claim("role", utilisateur.getRole() != null ? utilisateur.getRole().toString() : null)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 jour
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }




    public String extractEmail(String token) {
        return parseToken(token).getBody().getSubject();
    }




    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.out.println("Token invalide : " + e.getMessage());
            return false;
        }
    }


    private Jws<Claims> parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
    }
}

