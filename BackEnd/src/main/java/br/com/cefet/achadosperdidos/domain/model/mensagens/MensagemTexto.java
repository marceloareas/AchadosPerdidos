package br.com.cefet.achadosperdidos.domain.model.mensagens;

import br.com.cefet.achadosperdidos.domain.enums.TipoMensagemEnum;
import br.com.cefet.achadosperdidos.domain.model.BaseMensagem;

import java.time.LocalDateTime;

public class MensagemTexto extends BaseMensagem {
    public MensagemTexto(TipoMensagemEnum tipo, Long chatId, LocalDateTime dataEnvio, Long remetenteId, String conteudo) {
        super(tipo, chatId, dataEnvio, remetenteId, conteudo);
    }
}
