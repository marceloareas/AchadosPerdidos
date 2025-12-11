package br.com.cefet.achadosperdidos.dto.chat;

import java.util.List;

import br.com.cefet.achadosperdidos.domain.enums.TipoFinalizacaoMatch;
import br.com.cefet.achadosperdidos.dto.mensagem.BaseMensagemDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatComMensagensDTO extends BaseChatResponseDTO {
    private List<BaseMensagemDTO> mensagens;
    private String statusDoUsuarioNoMatch;
    private Boolean isMatchFinalizado;
    private TipoFinalizacaoMatch tipoFinalizacaoMatch;
}
