package br.com.cefet.achadosperdidos.dto.chat;

import java.util.Set;

import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.dto.usuario.UsuarioResponseDTO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BaseChatResponseDTO {
    private Long id;
    private Long match_id;
    private Set<UsuarioResponseDTO> usuarios;
}
