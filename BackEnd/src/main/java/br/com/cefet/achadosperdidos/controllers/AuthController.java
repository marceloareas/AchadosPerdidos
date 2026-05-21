package br.com.cefet.achadosperdidos.controllers;

import br.com.cefet.achadosperdidos.config.security.TokenService;
import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.domain.model.PasswordResetToken;
import br.com.cefet.achadosperdidos.dto.auth.UpdatePasswordRequestDTO;
import br.com.cefet.achadosperdidos.dto.auth.AuthenticatedDTO;
import br.com.cefet.achadosperdidos.dto.auth.AuthenticatedUserDTO;
import br.com.cefet.achadosperdidos.dto.auth.LoginDTO;
import br.com.cefet.achadosperdidos.dto.usuario.UsuarioRequestDTO;
import br.com.cefet.achadosperdidos.dto.usuario.UsuarioResponseDTO;
import br.com.cefet.achadosperdidos.dto.res.ApiResponse;
import br.com.cefet.achadosperdidos.services.UsuarioService;
import br.com.cefet.achadosperdidos.services.AuthService;
import br.com.cefet.achadosperdidos.services.EmailService;
import br.com.cefet.achadosperdidos.repositories.PasswordResetTokenRepository;
import br.com.cefet.achadosperdidos.repositories.UsuarioRepository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthenticatedDTO>> login(@RequestBody LoginDTO loginDTO) {
        AuthenticatedDTO auth = authService.login(loginDTO.getEmail(), loginDTO.getSenha());
        ApiResponse<AuthenticatedDTO> response = new ApiResponse<>("Usuário logado com sucesso!", auth);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UsuarioResponseDTO>> register(@RequestBody UsuarioRequestDTO usuarioRequestDTO) {
        UsuarioResponseDTO usuarioResponseDTO = usuarioService.create(usuarioRequestDTO);
        ApiResponse<UsuarioResponseDTO> response = new ApiResponse<>("Usuário registrado com sucesso!", "usuario", usuarioResponseDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/updatePassword")
    public ResponseEntity<ApiResponse<String>> updatePassword(@RequestBody UpdatePasswordRequestDTO updatePasswordRequestDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario) auth.getPrincipal();
        
        String resposta = usuarioService.updatePassword(
            usuario.getId(),
            updatePasswordRequestDTO.getSenha(),
            updatePasswordRequestDTO.getConfirmacaoSenha()
        );
        
        ApiResponse<String> response = new ApiResponse<>(resposta, null, null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthenticatedUserDTO> getAuthenticatedUser(@RequestHeader("Authorization") String token) {
        AuthenticatedUserDTO user = authService.getAuthenticatedUser(token);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/validateToken")
    public ResponseEntity<ApiResponse<Boolean>> validateToken(@RequestBody String token) {
        boolean isTokenValid = tokenService.verifyToken(token);
        ApiResponse<Boolean> response = new ApiResponse<Boolean>(null, isTokenValid);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(request.email());

            if (usuarioOpt.isPresent()) {
                Usuario usuario = usuarioOpt.get();
                tokenRepository.deleteByUsuario(usuario);

                String tokenStr = UUID.randomUUID().toString();
                PasswordResetToken resetToken = new PasswordResetToken(tokenStr, usuario);
                tokenRepository.save(resetToken);

                emailService.enviarEmailRecuperacao(usuario.getEmail(), tokenStr);
            }
            
            // Retorna sucesso mesmo que não encontre (boa prática de segurança)
            return ResponseEntity.ok(new ApiResponse<>("Se o e-mail existir, você receberá um link.", null));

        } catch (Exception e) {
            System.err.println("❌ ERRO NO FLUXO FORGOT-PASSWORD: " + e.getMessage());
            e.printStackTrace();
            // Retorna 500 para o React saber que houve erro no servidor (SMTP/SSL)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new ApiResponse<>("Erro no servidor ao enviar e-mail. Verifique os logs.", null));
        }
    }

    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody ResetPasswordRequest request) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(request.token());

        if (tokenOpt.isEmpty() || tokenOpt.get().isExpirado()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(new ApiResponse<>("Token inválido ou expirado.", null));
        }

        PasswordResetToken resetToken = tokenOpt.get();
        Usuario usuario = resetToken.getUsuario();

        usuario.setSenha(passwordEncoder.encode(request.novaSenha()));
        usuarioRepository.save(usuario);

        tokenRepository.delete(resetToken);

        return ResponseEntity.ok(new ApiResponse<>("Senha alterada com sucesso!", null));
    }
}

record ForgotPasswordRequest(String email) {}
record ResetPasswordRequest(String token, String novaSenha) {}