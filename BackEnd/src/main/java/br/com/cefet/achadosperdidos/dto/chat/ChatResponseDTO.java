package br.com.cefet.achadosperdidos.dto.chat;

import java.util.List;
import java.util.Set;

import br.com.cefet.achadosperdidos.domain.model.Usuario;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatResponseDTO {
    private Long id;
    private Long match_id;
    private Set<Usuario> usuarios;
}
