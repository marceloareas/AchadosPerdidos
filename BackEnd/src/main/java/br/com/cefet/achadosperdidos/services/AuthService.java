package br.com.cefet.achadosperdidos.services;

import br.com.cefet.achadosperdidos.config.security.TokenService;
import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.dto.auth.AuthenticatedDTO;
import br.com.cefet.achadosperdidos.dto.auth.AuthenticatedUserDTO;
import br.com.cefet.achadosperdidos.exception.auth.InvalidCredentials;
import br.com.cefet.achadosperdidos.repositories.UsuarioRepository;
import ch.qos.logback.core.subst.Token;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TokenService tokenService;

    public AuthenticatedDTO login(String email, String senha) {

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentials("Usuário não encontrado ou senha inválida."));

        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new InvalidCredentials("Usuário não encontrado ou senha inválida.");
        }

        String token = tokenService.generateToken(usuario);

        AuthenticatedDTO authenticatedDTO = new AuthenticatedDTO();
        authenticatedDTO.setToken(token);

        return authenticatedDTO;
    }

    public AuthenticatedUserDTO getAuthenticatedUser(String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            throw new InvalidCredentials("Token ausente ou inválido.");
        }

        String token = bearerToken.replace("Bearer ", "");
        Long userId = tokenService.validateToken(token);

        if (userId == null) {
            throw new InvalidCredentials("Token inválido ou expirado.");
        }

        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new InvalidCredentials("Usuário não encontrado."));

        AuthenticatedUserDTO dto = new AuthenticatedUserDTO();
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        return dto;
    }

}
