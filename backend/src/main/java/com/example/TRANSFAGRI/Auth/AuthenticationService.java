package com.example.TRANSFAGRI.auth;

import com.example.TRANSFAGRI.Configuration.JwtUtil;
import com.example.TRANSFAGRI.dto.UtilisateurDto;
import com.example.TRANSFAGRI.dto.Role;
import com.example.TRANSFAGRI.Model.Utilisateur;
import com.example.TRANSFAGRI.Repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

        private final UtilisateurRepository repository;
    private final PasswordEncoder passwordEncoder;
        private final JwtUtil jwtService;
    private final AuthenticationManager authenticationManager;



    public  AuthenticationResponse register( RegisterRequest request){
        var utilisateur = Utilisateur.builder()
                .email(request.getEmail())
                .motdepasse(passwordEncoder.encode(request.getMotdepasse()))
                .role(request.getRole())
                .build();

        repository.save(utilisateur);
        var jwtToken= jwtService.generateToken(utilisateur);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(utilisateur.getRole())
                .build();
    }

    public AuthenticationResponse authenticate ( AuthenticationRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getMotdepasse()
                )
        );
        var utilisateur= repository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken= jwtService.generateToken(utilisateur);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(utilisateur.getRole())
                .build();


    }


}
