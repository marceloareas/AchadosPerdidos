package br.com.cefet.achadosperdidos.controllers;

import br.com.cefet.achadosperdidos.config.security.TokenService;
import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.dto.auth.UpdatePasswordRequestDTO;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

import br.com.cefet.achadosperdidos.services.UsuarioService;
import br.com.cefet.achadosperdidos.dto.auth.AuthenticatedDTO;
import br.com.cefet.achadosperdidos.dto.auth.AuthenticatedUserDTO;
import br.com.cefet.achadosperdidos.dto.auth.LoginDTO;
import br.com.cefet.achadosperdidos.dto.usuario.UsuarioRequestDTO;
import br.com.cefet.achadosperdidos.dto.usuario.UsuarioResponseDTO;
import br.com.cefet.achadosperdidos.services.AuthService;
import br.com.cefet.achadosperdidos.dto.res.ApiResponse;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private TokenService tokenService;

    
    @PostMapping("/login")
    // public ResponseEntity<AuthenticatedDTO> login(@RequestBody LoginDTO loginDTO) {
    public ResponseEntity<ApiResponse<AuthenticatedDTO>> login(@RequestBody LoginDTO loginDTO){
        AuthenticatedDTO auth = authService.login(loginDTO.getEmail(), loginDTO.getSenha());
        
        ApiResponse<AuthenticatedDTO> response = new ApiResponse<>(
            "Usuário logado com sucesso!",
            auth
            );
            //     return ResponseEntity.ok(auth);
         return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/register")
    // public ResponseEntity<String> register(@RequestBody UsuarioRequestDTO usuarioRequestDTO) {
    public ResponseEntity<ApiResponse<UsuarioResponseDTO>> register(@RequestBody UsuarioRequestDTO usuarioRequestDTO) {
        UsuarioResponseDTO usuarioResponseDTO = usuarioService.create(usuarioRequestDTO);
        
        ApiResponse<UsuarioResponseDTO> response = new ApiResponse<>(
            "Usuário registrado com sucesso!",
            "usuario",
            usuarioResponseDTO
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            //     return ResponseEntity.ok("Usuário registrado com sucesso!");
    }

    @PostMapping("/updatePassword")
    // public ResponseEntity<String> updatePassword(@RequestBody UpdatePasswordRequestDTO updatePasswordRequestDTO) {
        public ResponseEntity<ApiResponse<String>> updatePassword(@RequestBody UpdatePasswordRequestDTO updatePasswordRequestDTO) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Usuario usuario = (Usuario) auth.getPrincipal();
            
            String resposta = usuarioService.updatePassword(
                usuario.getId(),
                updatePasswordRequestDTO.getSenha(),
                updatePasswordRequestDTO.getConfirmacaoSenha()
                );
                
            ApiResponse<String> response = new ApiResponse<>(resposta, null, null);
                //     return ResponseEntity.ok(resposta);
        return ResponseEntity.ok(response);
    }
     @GetMapping("/me")
    public ResponseEntity<AuthenticatedUserDTO> getAuthenticatedUser(
            @RequestHeader("Authorization") String token) {
        AuthenticatedUserDTO user = authService.getAuthenticatedUser(token);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/validateToken")
    public ResponseEntity<ApiResponse<Boolean>> validateToken(@RequestBody String token) {
        System.out.println("token chegando: " + token);
        boolean isTokenValid = tokenService.verifyToken(token);
        ApiResponse<Boolean> response = new ApiResponse<Boolean>(null, isTokenValid);
        return ResponseEntity.ok(response);
    }
    
}
