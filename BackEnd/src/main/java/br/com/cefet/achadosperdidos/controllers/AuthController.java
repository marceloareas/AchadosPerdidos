package br.com.cefet.achadosperdidos.controllers;

import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.dto.auth.UpdatePasswordRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.cefet.achadosperdidos.services.UsuarioService;
import br.com.cefet.achadosperdidos.dto.auth.AuthenticatedDTO;
import br.com.cefet.achadosperdidos.dto.auth.LoginDTO;
import br.com.cefet.achadosperdidos.dto.usuario.UsuarioRequestDTO;
import br.com.cefet.achadosperdidos.dto.usuario.UsuarioResponseDTO;
import br.com.cefet.achadosperdidos.services.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<AuthenticatedDTO> login(@RequestBody LoginDTO loginDTO){
        AuthenticatedDTO auth = authService.login(loginDTO.getEmail(), loginDTO.getSenha());
        return ResponseEntity.ok(auth);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UsuarioRequestDTO usuarioRequestDTO){
        UsuarioResponseDTO usuarioResponseDTO = usuarioService.create(usuarioRequestDTO);
        return ResponseEntity.ok("Usuário registrado com sucesso!");
    }

    @PostMapping("/updatePassword")
    public ResponseEntity<String> updatePassword(@RequestBody UpdatePasswordRequestDTO updatePasswordRequestDTO){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario)auth.getPrincipal();
        String resposta = usuarioService.updatePassword(usuario.getId(), updatePasswordRequestDTO.getSenha(), updatePasswordRequestDTO.getConfirmacaoSenha());
        return ResponseEntity.ok(resposta);
    }
}
