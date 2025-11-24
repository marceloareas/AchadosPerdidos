package br.com.cefet.achadosperdidos.dto.chat;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MeusChatsResponseDTO {
    private List<ChatVitrineResponseDTO> chats;
}
