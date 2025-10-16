package com.example.TRANSFAGRI.Auth;

import com.example.TRANSFAGRI.Configuration.JwtUtil;
import com.example.TRANSFAGRI.Model.Utilisateur;
import com.example.TRANSFAGRI.Repository.UtilisateurRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

                private final UtilisateurRepository repository;
    private final PasswordEncoder passwordEncoder;
                private final JwtUtil jwtService;
    private final AuthenticationManager authenticationManager;

        public AuthenticationService(UtilisateurRepository repository,
                                                                 PasswordEncoder passwordEncoder,
                                                                 JwtUtil jwtService,
                                                                 AuthenticationManager authenticationManager) {
                this.repository = repository;
                this.passwordEncoder = passwordEncoder;
                this.jwtService = jwtService;
                this.authenticationManager = authenticationManager;
        }


    public  AuthenticationResponse register( RegisterRequest request){
    Utilisateur utilisateur = new Utilisateur();
    utilisateur.setNom(request.getNom());
    utilisateur.setEmail(request.getEmail());
    utilisateur.setMotdepasse(passwordEncoder.encode(request.getMotdepasse()));
    utilisateur.setRole(request.getRole());

        repository.save(utilisateur);
        String jwtToken = jwtService.generateToken(utilisateur);
        AuthenticationResponse response = new AuthenticationResponse();
        response.setToken(jwtToken);
        response.setRole(utilisateur.getRole());
        return response;
    }

    public AuthenticationResponse authenticate ( AuthenticationRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getMotdepasse()
                )
        );
        Utilisateur utilisateur = repository.findByEmail(request.getEmail()).orElseThrow();
        String jwtToken = jwtService.generateToken(utilisateur);

        AuthenticationResponse response = new AuthenticationResponse();
        response.setToken(jwtToken);
        response.setRole(utilisateur.getRole());
        return response;


    }


}
