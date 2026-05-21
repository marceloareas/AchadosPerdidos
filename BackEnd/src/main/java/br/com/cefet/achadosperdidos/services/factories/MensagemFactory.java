package br.com.cefet.achadosperdidos.services.factories;

import br.com.cefet.achadosperdidos.domain.enums.TipoMensagemEnum;
import br.com.cefet.achadosperdidos.domain.model.BaseMensagem;
import br.com.cefet.achadosperdidos.domain.model.mensagens.MensagemConfirmacao;
import br.com.cefet.achadosperdidos.domain.model.mensagens.MensagemTexto;
import br.com.cefet.achadosperdidos.dto.mensagem.BaseMensagemDTO;
import org.springframework.stereotype.Component;

@Component
public class MensagemFactory {

    public BaseMensagem criarMensagem (Long chat_id, BaseMensagemDTO mensagemDTO){
        TipoMensagemEnum tipoDTO = mensagemDTO.getTipo();

         return switch(tipoDTO){
             case TEXTO -> {
                 yield new MensagemTexto(tipoDTO, chat_id, mensagemDTO.getDataEnvio(), mensagemDTO.getRemetenteId(), mensagemDTO.getDestinatarioId(), mensagemDTO.getConteudo(), mensagemDTO.getImageUrl());
             }
             case CONFIRMACAO -> {
                 yield new MensagemConfirmacao(tipoDTO, chat_id, mensagemDTO.getDataEnvio(), mensagemDTO.getRemetenteId(), mensagemDTO.getDestinatarioId(), mensagemDTO.getConteudo(), mensagemDTO.getImageUrl());
             }
             
             case IMAGEM -> {
                 yield new MensagemTexto(tipoDTO, chat_id, mensagemDTO.getDataEnvio(), mensagemDTO.getRemetenteId(), mensagemDTO.getDestinatarioId(), mensagemDTO.getConteudo(), mensagemDTO.getImageUrl());
             }
             // ----------------------------------------------------------------
             default -> throw new IllegalArgumentException("Tipo de mensagem não suportado.");
         };
    }
}