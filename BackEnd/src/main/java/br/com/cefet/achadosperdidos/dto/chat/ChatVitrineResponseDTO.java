package br.com.cefet.achadosperdidos.dto.chat;

import br.com.cefet.achadosperdidos.dto.mensagem.BaseMensagemDTO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatVitrineResponseDTO extends BaseChatResponseDTO {
    private String nomeItemPerdido;
    private String nomeItemAchado;
    private BaseMensagemDTO ultimaMensagem;

}
