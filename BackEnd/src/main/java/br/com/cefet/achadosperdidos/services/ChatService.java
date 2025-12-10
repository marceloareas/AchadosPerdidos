package br.com.cefet.achadosperdidos.services;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.Collections;

import br.com.cefet.achadosperdidos.config.RabbitConfig;
import br.com.cefet.achadosperdidos.domain.model.BaseMensagem;
import br.com.cefet.achadosperdidos.dto.chat.ChatComMensagensDTO;
import br.com.cefet.achadosperdidos.dto.chat.MeusChatsResponseDTO;
import br.com.cefet.achadosperdidos.dto.chat.ChatVitrineResponseDTO;
import br.com.cefet.achadosperdidos.repositories.MensagemRepository;
import br.com.cefet.achadosperdidos.services.factories.MensagemFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.cefet.achadosperdidos.domain.model.Chat;
import br.com.cefet.achadosperdidos.domain.model.Match;
import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.dto.mensagem.BaseMensagemDTO;
import br.com.cefet.achadosperdidos.dto.res.ApiResponse;
import br.com.cefet.achadosperdidos.exception.auth.NotAuthorized;
import br.com.cefet.achadosperdidos.exception.match.MatchNotFoundException;
import br.com.cefet.achadosperdidos.mappers.ChatMapper;
import br.com.cefet.achadosperdidos.repositories.ChatRepository;
import br.com.cefet.achadosperdidos.repositories.MatchRepository;
import jakarta.transaction.Transactional;


@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private MensagemRepository mensagemRepository;

    @Autowired
    private ChatMapper chatMapper;

    @Autowired
    private MensagemFactory mensagemFactory;

    @Autowired
    private RabbitConfig rabbitConfig;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private MatchService matchService;

    @Transactional
    public ApiResponse<MeusChatsResponseDTO> getChats(Long userId) {
        List<Chat> chatList = this.chatRepository.findByUsuarioId(userId);
        List<ChatVitrineResponseDTO> chatVitrine = chatList.stream()
                .map(chat -> {
                    List<BaseMensagem> mensagens
                            = mensagemRepository.findByChatIdOrderByDataEnvioAsc(chat.getId());

                    if (mensagens == null) {
                        mensagens = Collections.emptyList();
                    }

                    return chatMapper.convertToChatVitrineResponseDTO(chat, mensagens);
                }).toList();

        MeusChatsResponseDTO meusChats = new MeusChatsResponseDTO();
        meusChats.setChats(chatVitrine);
        return new ApiResponse<MeusChatsResponseDTO>("Chats encontrados.", meusChats);
    }

    @Transactional
    public ApiResponse<ChatComMensagensDTO> getChat(Long match_id, Usuario usuario) {
        Match match = matchRepository.findById(match_id).orElseThrow(() -> new MatchNotFoundException("Match não encontrado."));

        boolean isUsuarioItemAchado = usuario.getId().equals(match.getItemAchado().getUsuario().getId());
        boolean isUsuarioItemPerdido = usuario.getId().equals(match.getItemPerdido().getUsuario().getId());
        
        // Verifica se o usuário da requisição é parte integrante do Chat
        if (!isUsuarioItemAchado && !isUsuarioItemPerdido) {
            throw new NotAuthorized("Chat não pertence ao usuario.");
        }

        // Verifica se já existe um chat atrelado a esse Match
        Optional<Chat> alreadyExistingChat = chatRepository.findByMatchId(match_id);
        Chat chat;
        String messageResponse;
        List<BaseMensagem> mensagens;

        // Caso já exista um chat
        if (alreadyExistingChat.isPresent()) {

            // Objeto chat é materializado
            chat = alreadyExistingChat.get();
            // As mensagens atreladas ao chat são recuperadas
            mensagens = mensagemRepository.findByChatIdOrderByDataEnvioAsc(chat.getId());
            messageResponse = "Chat encontrado com sucesso.";
        }
        // Caso não exista um Chat
        else{
            // Um novo Chat é criado 
            chat = new Chat();
            // Setando relação entre Chat e Match
            chat.setMatch(match);

            // Setando relação entre os usuários do Match e Chat
            Set<Usuario> usuarios = new HashSet<>();
            usuarios.add(match.getItemAchado().getUsuario());
            usuarios.add(match.getItemPerdido().getUsuario());

            chat.setUsuarios(usuarios);
            chatRepository.save(chat);

            mensagens = Collections.emptyList();
            messageResponse = "Chat criado com sucesso.";
        }

        ChatComMensagensDTO chatDTO = chatMapper.convertToChatComMensagensDTO(chat, mensagens);

        String statusUsuarioNoMatch = matchService.getEstadoMatch(usuario, match_id);
        chatDTO.setStatusDoUsuarioNoMatch(statusUsuarioNoMatch);

        return new ApiResponse<ChatComMensagensDTO>(messageResponse, "chat", chatDTO);
    }

    @Transactional
    public ApiResponse<String> enviarMensagem(Long chat_id, BaseMensagemDTO mensagemDTO) {

        BaseMensagem mensagem = mensagemFactory.criarMensagem(chat_id, mensagemDTO);

        BaseMensagem mensagemSalva = mensagemRepository.save(mensagem);
        //todo: modificar a mensagem para ser enviada de acordo com a instancia (usar factory).

        String routingKey =  "user." + mensagemDTO.getDestinatarioId();
        
        rabbitTemplate.convertAndSend(
            RabbitConfig.TOPIC_EXCHANGE_NAME,
            routingKey,
            mensagemSalva
        );

        return new ApiResponse<String>("Mensagem enviada com sucesso.", null);
    }
}
