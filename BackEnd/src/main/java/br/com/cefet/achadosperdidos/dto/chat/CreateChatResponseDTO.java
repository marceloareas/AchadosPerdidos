package br.com.cefet.achadosperdidos.dto.chat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateChatResponseDTO extends ChatResponseDTO{
    private Boolean chatJaExiste;
}
