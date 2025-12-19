package br.com.cefet.achadosperdidos.dto.mensagem;

import java.time.LocalDateTime;

public record ImageMensagemMetadataDTO(
    Long remetenteId, 
    Long destinatarioId, 
    LocalDateTime dataEnvio
) {}