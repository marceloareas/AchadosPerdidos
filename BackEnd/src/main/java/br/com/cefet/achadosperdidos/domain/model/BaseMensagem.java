package br.com.cefet.achadosperdidos.domain.model;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import br.com.cefet.achadosperdidos.domain.enums.TipoMensagemEnum;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Document(collection = "mensagens")
public class BaseMensagem {

    @Id
    @Getter
    private String id;

    @Getter
    @Setter
    private TipoMensagemEnum tipo;

    @Getter
    @Setter
    private Long chatId;

    @Getter
    @Setter
    private LocalDateTime dataEnvio;

    @Getter
    @Setter
    private Long remetenteId;
    
    @Getter
    @Setter
    private String conteudo;
    
}
