package br.com.cefet.achadosperdidos.dto.usuario;

import lombok.Getter;
import lombok.Setter;

public class UsuarioResponseDTO{
    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private String nome;

    @Getter
    @Setter
    private String email;
}
