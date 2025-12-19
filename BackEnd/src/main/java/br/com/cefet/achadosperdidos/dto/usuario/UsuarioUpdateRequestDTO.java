package br.com.cefet.achadosperdidos.dto.usuario;

import lombok.Getter;
import lombok.Setter;

public class UsuarioUpdateRequestDTO{

    @Getter
    @Setter
    private String nome;

    @Getter
    @Setter
    private String email;
}