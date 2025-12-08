package br.com.cefet.achadosperdidos.mappers;

import br.com.cefet.achadosperdidos.domain.model.BaseMensagem;
import br.com.cefet.achadosperdidos.domain.model.Match;
import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.dto.chat.BaseChatResponseDTO;
import br.com.cefet.achadosperdidos.dto.chat.ChatVitrineResponseDTO;
import br.com.cefet.achadosperdidos.dto.chat.ChatComMensagensDTO;
import br.com.cefet.achadosperdidos.dto.chat.MeusChatsResponseDTO;
import br.com.cefet.achadosperdidos.dto.usuario.UsuarioResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.com.cefet.achadosperdidos.domain.model.Chat;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ChatMapper {

    @Autowired
    private MensagemMapper mensagemMapper;

    @Autowired
    private UsuarioMapper usuarioMapper;

    public BaseChatResponseDTO convertToBaseChatResponseDTO(Chat chat) {
        BaseChatResponseDTO dto = new BaseChatResponseDTO();
        dto.setId(chat.getId());
        dto.setMatch_id(chat.getMatch().getId());
        Set<UsuarioResponseDTO> usuarioSet = chat.getUsuarios().stream().map(usuarioMapper::convertToResponseDTO).collect(Collectors.toSet());
        dto.setUsuarios(usuarioSet);

        return dto;
    }

    public ChatComMensagensDTO convertToChatComMensagensDTO(Chat chat, List<BaseMensagem> mensagens) {

        Match matchCorrespondente = chat.getMatch();
        ChatComMensagensDTO chatComMensagensDTO = new ChatComMensagensDTO();
        chatComMensagensDTO.setId(chat.getId());
        chatComMensagensDTO.setMatch_id(chat.getMatch().getId());

        Set<UsuarioResponseDTO> usuarioSet = new HashSet<>();
        usuarioSet.add(usuarioMapper.convertToResponseDTO(matchCorrespondente.getItemAchado().getUsuario()));
        usuarioSet.add(usuarioMapper.convertToResponseDTO(matchCorrespondente.getItemPerdido().getUsuario()));
        chatComMensagensDTO.setUsuarios(usuarioSet);

        chatComMensagensDTO.setMensagens(mensagens.stream().map(baseMensagem -> mensagemMapper.mapMensagemParaDTO(baseMensagem)).toList());

        return chatComMensagensDTO;

    }

    public ChatVitrineResponseDTO convertToChatVitrineResponseDTO(Chat chat, List<BaseMensagem> mensagens) {

        Match matchCorrespondente = chat.getMatch();

        ChatVitrineResponseDTO chatVitrineResponseDTO = new ChatVitrineResponseDTO();
        chatVitrineResponseDTO.setId(chat.getId());
        chatVitrineResponseDTO.setMatch_id(matchCorrespondente.getId());

        Set<UsuarioResponseDTO> usuarioSet = new HashSet<>();
        usuarioSet.add(usuarioMapper.convertToResponseDTO(matchCorrespondente.getItemPerdido().getUsuario()));
        usuarioSet.add(usuarioMapper.convertToResponseDTO(matchCorrespondente.getItemAchado().getUsuario()));
        chatVitrineResponseDTO.setUsuarios(usuarioSet);

        chatVitrineResponseDTO.setNomeItemPerdido(matchCorrespondente.getItemPerdido().getNome());
        chatVitrineResponseDTO.setNomeItemAchado(matchCorrespondente.getItemAchado().getNome());
        BaseMensagem ultima
                = (mensagens != null && !mensagens.isEmpty())
                ? mensagens.get(mensagens.size() - 1)
                : null;

        chatVitrineResponseDTO.setUltimaMensagem(
                ultima != null ? mensagemMapper.mapMensagemParaDTO(ultima) : null
        );

        return chatVitrineResponseDTO;
    }

//    public CreateChatResponseDTO convertToCreateChatResponseDTO(Chat chat, Boolean jaExiste) {
//        CreateChatResponseDTO dto = new CreateChatResponseDTO();
//        dto.setId(chat.getId());
//        dto.setMatch_id(chat.getMatch().getId());
//        dto.setUsuarios(chat.getUsuarios());
//        dto.setChatJaExiste(jaExiste);
//
//        return dto;
//    }
}
