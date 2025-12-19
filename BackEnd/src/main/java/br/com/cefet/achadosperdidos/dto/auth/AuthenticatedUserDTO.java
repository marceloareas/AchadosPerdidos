package br.com.cefet.achadosperdidos.dto.auth;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AuthenticatedUserDTO {
    private String nome;
    private String email;
}
