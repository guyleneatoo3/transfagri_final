package com.example.TRANSFAGRI.Model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "emf")
@Data
public class EMF {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String denomination;
    private String localisation;

    @JsonProperty("Dirigeant")
    private String dirigeant;

    @JsonProperty("Numero_d_agreement")
    private String numeroDAgrement;

    @JsonProperty("NumeroCNC")
    private String numeroCNC;

    private String email;

    @OneToMany
    @JoinColumn(name = "emf_id")
    private List<Utilisateur> utilisateurs;

    public EMF() {}

    public EMF(String denomination, String localisation, String dirigeant, String numeroDAgrement, String numeroCNC, String email) {
        this.denomination = denomination;
        this.localisation = localisation;
        this.dirigeant = dirigeant;
        this.numeroDAgrement = numeroDAgrement;
        this.numeroCNC = numeroCNC;
        this.email = email;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDenomination() { return denomination; }
    public void setDenomination(String denomination) { this.denomination = denomination; }
    public String getLocalisation() { return localisation; }
    public void setLocalisation(String localisation) { this.localisation = localisation; }
    public String getDirigeant() { return dirigeant; }
    public void setDirigeant(String dirigeant) { this.dirigeant = dirigeant; }
    public String getNumeroDAgrement() { return numeroDAgrement; }
    public void setNumeroDAgrement(String numeroDAgrement) { this.numeroDAgrement = numeroDAgrement; }
    public String getNumeroCNC() { return numeroCNC; }
    public void setNumeroCNC(String numeroCNC) { this.numeroCNC = numeroCNC; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public List<Utilisateur> getUtilisateurs() { return utilisateurs; }
    public void setUtilisateurs(List<Utilisateur> utilisateurs) { this.utilisateurs = utilisateurs; }
}
