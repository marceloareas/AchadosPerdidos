package br.com.cefet.achadosperdidos.domain.model.mensagens;

import java.time.LocalDateTime;

import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import br.com.cefet.achadosperdidos.domain.enums.TipoMensagemEnum;
import br.com.cefet.achadosperdidos.domain.model.BaseMensagem;

public class MensagemImagem extends BaseMensagem {
    public MensagemImagem(TipoMensagemEnum tipo, Long chatId, LocalDateTime dataEnvio, Long remetenteId, Long destinatarioId, String conteudoBase64) {
        super(tipo, chatId, dataEnvio, remetenteId, destinatarioId, conteudoBase64);
    }
}