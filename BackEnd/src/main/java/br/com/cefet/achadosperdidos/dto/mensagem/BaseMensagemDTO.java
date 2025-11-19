package br.com.cefet.achadosperdidos.dto.mensagem;

import java.time.LocalDateTime;

import br.com.cefet.achadosperdidos.domain.enums.TipoMensagemEnum;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BaseMensagemDTO {
    private Long chat_id;
    private LocalDateTime dataEnvio;
    private TipoMensagemEnum tipo;
    private Long remetenteId;
    private String conteudo;
}
