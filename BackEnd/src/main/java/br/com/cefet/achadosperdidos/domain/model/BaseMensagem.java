package br.com.cefet.achadosperdidos.domain.model;

import java.time.LocalDateTime;

import lombok.ToString;
import org.springframework.data.mongodb.core.mapping.Document;

import br.com.cefet.achadosperdidos.domain.enums.TipoMensagemEnum;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@ToString
@Document(collection = "mensagens")
public class BaseMensagem {
    
    // Construtor atualizado para receber a imageUrl
    public BaseMensagem(TipoMensagemEnum tipo, Long chatId, LocalDateTime dataEnvio, Long remetenteId, Long destinatarioId, String conteudo, String imageUrl) {
        this.tipo = tipo;
        this.chatId = chatId;
        this.dataEnvio = dataEnvio;
        this.remetenteId = remetenteId;
        this.conteudo = conteudo;
        this.destinatarioId = destinatarioId;
        this.imageUrl = imageUrl; // <-- NOVO
    }

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
    private Long destinatarioId;
    
    @Getter
    @Setter
    private String conteudo;
    
    // <-- NOVO CAMPO ADICIONADO -->
    @Getter
    @Setter
    private String imageUrl; 
    
}
