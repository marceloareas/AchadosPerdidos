package br.com.cefet.achadosperdidos.services;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import br.com.cefet.achadosperdidos.domain.model.Chat;
import br.com.cefet.achadosperdidos.domain.model.Match;
import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.dto.chat.ChatResponseDTO;
import br.com.cefet.achadosperdidos.dto.chat.CreateChatResponseDTO;
import br.com.cefet.achadosperdidos.dto.mensagem.BaseMensagemDTO;
import br.com.cefet.achadosperdidos.dto.res.ApiResponse;
import br.com.cefet.achadosperdidos.exception.auth.NotAuthorized;
import br.com.cefet.achadosperdidos.exception.match.MatchNotFoundException;
import br.com.cefet.achadosperdidos.mappers.ChatMapper;
import br.com.cefet.achadosperdidos.repositories.ChatRespository;
import br.com.cefet.achadosperdidos.repositories.MatchRepository;
import jakarta.transaction.Transactional;

@Service
public class ChatService {

    @Autowired
    private ChatRespository chatRespository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private ChatMapper chatMapper;

    @Transactional
    public ApiResponse<CreateChatResponseDTO> getChat(Long match_id, Usuario usuario){
        Match match = matchRepository.findById(match_id).orElseThrow(() -> new MatchNotFoundException("Match não encontrado."));


        boolean isUsuarioItemAchado = usuario.getId().equals(match.getItemAchado().getUsuario().getId());
        boolean isUsuarioItemPerdido = usuario.getId().equals(match.getItemPerdido().getUsuario().getId());
        if(!isUsuarioItemAchado && !isUsuarioItemPerdido) throw new NotAuthorized("Chat não pertence ao usuario.");
        

        Optional<Chat> alreadyExistingChat = chatRespository.findByMatchId(match_id);

        if(alreadyExistingChat.isPresent()) return new ApiResponse<CreateChatResponseDTO>("Chat encontrado com sucesso.", chatMapper.convertToCreateChatResponseDTO(alreadyExistingChat.get(), true));

        Chat chat = new Chat();

        chat.setMatch(match);

        //todo: refatorar essa logica.
        Set<Usuario> usuarios = new HashSet<>();
        usuarios.add(match.getItemAchado().getUsuario());
        usuarios.add(match.getItemPerdido().getUsuario());

        chat.setUsuarios(usuarios);

        chatRespository.save(chat);

        return new ApiResponse<CreateChatResponseDTO>("Chat criado com sucesso.", chatMapper.convertToCreateChatResponseDTO(chat, false));
    }

    @Transactional
    public ApiResponse<String> enviarMensagem(Long chat_id, BaseMensagemDTO mensagem){
        
        
        //todo:  instanciar mensagem com factory

        //todo:  save na mensagem com ChatRepository

        //todo:  Enviar mensagem para 
        


        return new ApiResponse<String>("Mensagem enviada com sucesso.", null);
    }
}
