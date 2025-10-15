package com.example.TRANSFAGRI.Service;
import com.example.TRANSFAGRI.dto.ChangePasswordRequest;
import com.example.TRANSFAGRI.dto.UtilisateurDto;
import com.example.TRANSFAGRI.dto.UtilisateurResponse;
import com.example.TRANSFAGRI.Model.Utilisateur;
import com.example.TRANSFAGRI.Model.Role;
import com.example.TRANSFAGRI.Repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UtilisateurServiceImpl implements UtilisateurService {

	@Autowired
	private UtilisateurRepository utilisateurRepository;


	@Override
	public List<UtilisateurResponse> getAllUtilisateurs() {
		return utilisateurRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
	}

	@Override
	public Optional<Utilisateur> getUtilisateurById(Long id) {
		return utilisateurRepository.findById(id);
	}

	@Override
	public Utilisateur saveUtilisateur(UtilisateurDto utilisateurDto) {
		Utilisateur utilisateur = new Utilisateur();
		utilisateur.setEmail(utilisateurDto.getEmail());
		utilisateur.setMotdepasse(utilisateurDto.getMotdepasse());
		// Convert DTO Role to Model Role
		if (utilisateurDto.getRole() != null) {
			utilisateur.setRole(Role.valueOf(utilisateurDto.getRole().name()));
		} else {
			utilisateur.setRole(null);
		}
		utilisateur.setNom(utilisateurDto.getNom());
		return utilisateurRepository.save(utilisateur);
	}

	@Override
	public Utilisateur updateUtilisateur(Long id, UtilisateurDto utilisateurDto) {
		Utilisateur utilisateur = utilisateurRepository.findById(id).orElseThrow();
		utilisateur.setEmail(utilisateurDto.getEmail());
		utilisateur.setMotdepasse(utilisateurDto.getMotdepasse());
		if (utilisateurDto.getRole() != null) {
			utilisateur.setRole(Role.valueOf(utilisateurDto.getRole().name()));
		} else {
			utilisateur.setRole(null);
		}
		utilisateur.setNom(utilisateurDto.getNom());
		return utilisateurRepository.save(utilisateur);
	}

	@Override
	public void changePassword(ChangePasswordRequest request, java.security.Principal connectedUtilisateur) {
		// Dummy implementation, should be replaced with real logic
		// Example: find user by principal, check old password, set new password, save
		// Not implemented for now
	}

	@Override
	public void deleteUtilisateurById(Long id) {
		utilisateurRepository.deleteById(id);
	}
	@Override
	public Long countUtilisateurs() {
		return utilisateurRepository.count();
	}

	// Méthode utilitaire pour convertir Utilisateur en UtilisateurResponse
	private UtilisateurResponse toResponse(Utilisateur utilisateur) {
		UtilisateurResponse response = new UtilisateurResponse();
		response.setId(utilisateur.getIdutilisateur());
		response.setNom(utilisateur.getNom());
		response.setEmail(utilisateur.getEmail());
		response.setRole(utilisateur.getRole() != null ? utilisateur.getRole().name() : null);
		return response;
	}
}