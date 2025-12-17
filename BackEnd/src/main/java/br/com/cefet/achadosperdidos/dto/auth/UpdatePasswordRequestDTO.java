package br.com.cefet.achadosperdidos.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePasswordRequestDTO {
    private String senha;
    private String confirmacaoSenha;
}
