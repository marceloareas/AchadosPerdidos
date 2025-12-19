package br.com.cefet.achadosperdidos.mappers;

import br.com.cefet.achadosperdidos.domain.model.BaseMensagem;
import br.com.cefet.achadosperdidos.domain.model.mensagens.MensagemTexto;
import br.com.cefet.achadosperdidos.dto.mensagem.BaseMensagemDTO;
import br.com.cefet.achadosperdidos.dto.mensagem.MensagemConfirmacaoDTO;
import br.com.cefet.achadosperdidos.dto.mensagem.MensagemTextoDTO;
import org.springframework.stereotype.Component;

@Component
public class MensagemMapper {

    public BaseMensagemDTO mapMensagemParaDTO(BaseMensagem baseMensagem) {
        if (baseMensagem instanceof MensagemTexto mensagemTexto) {
            return mapMensagemTextoParaDTO(mensagemTexto);
        } 
        // else if (baseMensagem instanceof MensagemConfirmacao mensagemConfirmacao) {
        //     return mapMensagemConfirmacaoParaDTO(mensagemConfirmacao);
        // }

        // Mapeamento genérico (resolve seu problema atual)
        BaseMensagemDTO dto = new BaseMensagemDTO();
        dto.setConteudo(baseMensagem.getConteudo());
        dto.setDataEnvio(baseMensagem.getDataEnvio());
        dto.setRemetenteId(baseMensagem.getRemetenteId());
        dto.setDestinatarioId(baseMensagem.getDestinatarioId());
        dto.setTipo(baseMensagem.getTipo());
        return dto;
    }

    public MensagemTextoDTO mapMensagemTextoParaDTO(MensagemTexto mensagemTexto) {
        MensagemTextoDTO dto = new MensagemTextoDTO();
        dto.setTipo(mensagemTexto.getTipo());
        dto.setConteudo(mensagemTexto.getConteudo());
        dto.setDataEnvio(mensagemTexto.getDataEnvio());
        dto.setRemetenteId(mensagemTexto.getRemetenteId());
        dto.setDestinatarioId(mensagemTexto.getDestinatarioId());

        return dto;
    }
}
