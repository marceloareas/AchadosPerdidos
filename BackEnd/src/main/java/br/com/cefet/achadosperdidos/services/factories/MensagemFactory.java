package br.com.cefet.achadosperdidos.services.factories;

import br.com.cefet.achadosperdidos.domain.enums.TipoMensagemEnum;
import br.com.cefet.achadosperdidos.dto.mensagem.BaseMensagemDTO;

public class MensagemFactory {

    MensagemFactory (Long chat_id, BaseMensagemDTO mensagemDTO){
        Long remetenteId = mensagemDTO.getRemetenteId();
        String conteudo = mensagemDTO.getConteudo();

        TipoMensagemEnum tipoDTO = mensagemDTO.getTipo();

        // todo: fazer o factory dependendo do tipo
        // return switch(tipoDTO){

        // }
    }
    
}
