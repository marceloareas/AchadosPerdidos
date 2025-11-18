package br.com.cefet.achadosperdidos.services;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.cefet.achadosperdidos.domain.model.Chat;
import br.com.cefet.achadosperdidos.domain.model.Match;
import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.dto.chat.ChatResponseDTO;
import br.com.cefet.achadosperdidos.dto.chat.CreateChatResponseDTO;
import br.com.cefet.achadosperdidos.dto.res.ApiResponse;
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
    public ApiResponse<CreateChatResponseDTO> createChat(Long match_id){
        Optional<Chat> alreadyExistingChat = chatRespository.findByMatchId(match_id);

        if(alreadyExistingChat.isPresent()) return new ApiResponse<CreateChatResponseDTO>("Chat já existe.", chatMapper.convertToCreateChatResponseDTO(alreadyExistingChat.get(), true));

        Chat chat = new Chat();
        Match match = matchRepository.getById(match_id);
        chat.setMatch(match);

        //todo: refatorar essa logica.
        Set<Usuario> usuarios = new HashSet<>();
        usuarios.add(match.getItemAchado().getUsuario());
        usuarios.add(match.getItemPerdido().getUsuario());

        chat.setUsuarios(usuarios);

        chatRespository.save(chat);

        return new ApiResponse<CreateChatResponseDTO>("Chat criado com sucesso.", chatMapper.convertToCreateChatResponseDTO(chat, false));
    }
}
