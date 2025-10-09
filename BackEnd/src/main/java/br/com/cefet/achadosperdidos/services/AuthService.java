package br.com.cefet.achadosperdidos.services;

import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.dto.auth.AuthenticatedDTO;
import br.com.cefet.achadosperdidos.exception.auth.InvalidCredentials;
import br.com.cefet.achadosperdidos.repositories.UsuarioRepository;
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

    public AuthenticatedDTO login(String email, String senha){

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentials("Usuário não encontrado ou senha inválida."));


        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new InvalidCredentials("Usuário não encontrado ou senha inválida.");
        }

        // TODO: Implementar a geração de um token real
        String token = "TOKEN_JWT_GERADO_AQUI";

        AuthenticatedDTO authenticatedDTO = new AuthenticatedDTO();
        authenticatedDTO.setToken(token);

        return authenticatedDTO;
    }

}
