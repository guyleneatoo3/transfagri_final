package com.example.TRANSFAGRI.Model;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
public enum Role {
    ADMIN(Set.of("utilisateur:read", "utilisateur:write", "document:upload", "document:delete")),
    CNEF(Set.of("emf:manage", "formation:upload")),
    EMF(Set.of("formation:view", "questionnaire:answer")),
    PASNFI(Set.of("inspection:view", "rapport:write"));

    private final Set<String> permissions;

    Role(Set<String> permissions) {
        this.permissions = permissions;
    }

    public Set<String> getPermissions() {
        return permissions;
    }

    // 🔹 Convertit les permissions en autorités Spring Security
    public List<GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = permissions.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        // ajoute aussi le ROLE_xxx (obligatoire pour Spring Security)
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }

    // Accept both "ADMIN" and "ROLE_ADMIN" from JSON
    @JsonCreator
    public static Role fromString(String value) {
        if (value == null) return null;
        String normalized = value.toUpperCase();
        if (normalized.startsWith("ROLE_")) {
            normalized = normalized.substring(5);
        }
        return Role.valueOf(normalized);
    }

    // Optionally serialize as ROLE_ prefixed string
    @JsonValue
    public String toJson() {
        return "ROLE_" + this.name();
    }
}
