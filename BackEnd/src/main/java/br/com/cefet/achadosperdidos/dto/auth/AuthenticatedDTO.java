package br.com.cefet.achadosperdidos.dto.auth;

import br.com.cefet.achadosperdidos.dto.usuario.UsuarioResponseDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AuthenticatedDTO {
    private String token;
}
