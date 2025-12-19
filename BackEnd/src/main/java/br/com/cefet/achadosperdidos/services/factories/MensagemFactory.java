package br.com.cefet.achadosperdidos.services.factories;

import br.com.cefet.achadosperdidos.domain.enums.TipoMensagemEnum;
import br.com.cefet.achadosperdidos.domain.model.BaseMensagem;
import br.com.cefet.achadosperdidos.domain.model.mensagens.MensagemImagem;
import br.com.cefet.achadosperdidos.domain.model.mensagens.MensagemTexto;
import br.com.cefet.achadosperdidos.dto.mensagem.BaseMensagemDTO;
import org.springframework.stereotype.Component;

@Component
public class MensagemFactory {

    public BaseMensagem criarMensagem (Long chat_id, BaseMensagemDTO mensagemDTO){
        Long remetenteId = mensagemDTO.getRemetenteId();
        String conteudo = mensagemDTO.getConteudo();

        TipoMensagemEnum tipoDTO = mensagemDTO.getTipo();

         return switch(tipoDTO){
             case TEXTO -> {
                 yield new MensagemTexto(tipoDTO, chat_id, mensagemDTO.getDataEnvio(), mensagemDTO.getRemetenteId(), mensagemDTO.getDestinatarioId(), mensagemDTO.getConteudo());
             }
             case IMAGEM -> {
                 yield new MensagemImagem(tipoDTO, chat_id, mensagemDTO.getDataEnvio(), mensagemDTO.getRemetenteId(), mensagemDTO.getDestinatarioId(), mensagemDTO.getConteudo());
             }

             default -> throw new IllegalArgumentException("Tipo de mensagem não suportado.");
         };
    }
    
}
