package br.com.cefet.achadosperdidos.dto.usuario;

import lombok.Getter;
import lombok.Setter;

public class UsuarioRequestDTO {

    @Getter
    @Setter
    private String nome;

    @Getter
    @Setter
    private String email;

    @Getter
    @Setter
    private String senha;

}
