package com.example.TRANSFAGRI.Service;

import com.example.TRANSFAGRI.dto.ChangePasswordRequest;
import com.example.TRANSFAGRI.dto.UtilisateurDto;
import com.example.TRANSFAGRI.dto.UtilisateurResponse;
import com.example.TRANSFAGRI.Model.Utilisateur;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

public interface UtilisateurService {

    List<UtilisateurResponse> getAllUtilisateurs();

    Optional<Utilisateur> getUtilisateurById(Long id);

    Utilisateur saveUtilisateur(UtilisateurDto utilisateurDto);

    Utilisateur updateUtilisateur(Long id, UtilisateurDto utilisateurDto);

    void deleteUtilisateurById(Long id);

    void changePassword(ChangePasswordRequest request, Principal connectedUtilisateur);

    Long countUtilisateurs();
}
