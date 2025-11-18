package br.com.cefet.achadosperdidos.mappers;

import br.com.cefet.achadosperdidos.domain.model.Chat;
import br.com.cefet.achadosperdidos.dto.chat.ChatResponseDTO;
import br.com.cefet.achadosperdidos.dto.chat.CreateChatResponseDTO;

public class ChatMapper {
    

    public ChatResponseDTO convertToChatResponseDTO(Chat chat) {
        ChatResponseDTO dto = new ChatResponseDTO();
        dto.setId(chat.getId());
        dto.setMatch_id(chat.getMatch().getId());
        dto.setUsuarios(chat.getUsuarios());

        return dto;
    }

    public CreateChatResponseDTO convertToCreateChatResponseDTO(Chat chat, Boolean jaExiste) {
        CreateChatResponseDTO dto = new CreateChatResponseDTO();
        dto.setId(chat.getId());
        dto.setMatch_id(chat.getMatch().getId());
        dto.setUsuarios(chat.getUsuarios());
        dto.setChatJaExiste(jaExiste);

        return dto;
    }
}
