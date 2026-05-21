package br.com.cefet.achadosperdidos.services;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.Collections;

import br.com.cefet.achadosperdidos.config.RabbitConfig;
import br.com.cefet.achadosperdidos.domain.model.BaseMensagem;
import br.com.cefet.achadosperdidos.dto.chat.BotaoDTO;
import br.com.cefet.achadosperdidos.dto.chat.ChatComMensagensDTO;
import br.com.cefet.achadosperdidos.dto.chat.MeusChatsResponseDTO;
import br.com.cefet.achadosperdidos.dto.chat.ChatVitrineResponseDTO;

import br.com.cefet.achadosperdidos.exception.match.MatchFinalizadoException;
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
import br.com.cefet.achadosperdidos.exception.chat.ChatNotFoundException;
import br.com.cefet.achadosperdidos.exception.match.MatchNotFoundException;
import br.com.cefet.achadosperdidos.mappers.ChatMapper;
import br.com.cefet.achadosperdidos.repositories.ChatRepository;
import br.com.cefet.achadosperdidos.repositories.MatchRepository;
import jakarta.transaction.Transactional;

import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.io.IOException;


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

                    Match match = chat.getMatch();

                    return chatMapper.convertToChatVitrineResponseDTO(chat, mensagens, match);
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
        
        if (!isUsuarioItemAchado && !isUsuarioItemPerdido) {
            throw new NotAuthorized("Chat não pertence ao usuario.");
        }

        Optional<Chat> alreadyExistingChat = chatRepository.findByMatchId(match_id);
        Chat chat;
        String messageResponse;
        List<BaseMensagem> mensagens;

        if (alreadyExistingChat.isPresent()) {
            chat = alreadyExistingChat.get();
            mensagens = mensagemRepository.findByChatIdOrderByDataEnvioAsc(chat.getId());
            messageResponse = "Chat encontrado com sucesso.";
        }
        else{
            if(match.isFinalizado()){
                throw new MatchFinalizadoException("O Match já foi finalizado");
            }
            chat = new Chat();
            chat.setMatch(match);

            Set<Usuario> usuarios = new HashSet<>();
            usuarios.add(match.getItemAchado().getUsuario());
            usuarios.add(match.getItemPerdido().getUsuario());

            chat.setUsuarios(usuarios);
            chatRepository.save(chat);

            mensagens = Collections.emptyList();
            messageResponse = "Chat criado com sucesso.";
        }

        ChatComMensagensDTO chatDTO = chatMapper.convertToChatComMensagensDTO(chat, mensagens, match);

        BotaoDTO botao = matchService.getEstadoParaBotaoNoMatch(usuario, match_id);
        chatDTO.setBotao(botao);

        return new ApiResponse<ChatComMensagensDTO>(messageResponse, "chat", chatDTO);
    }

    @Transactional
    public ApiResponse<String> enviarMensagem(Long chat_id, BaseMensagemDTO mensagemDTO) {

        Chat chat = chatRepository.findById(chat_id).orElseThrow(() -> new ChatNotFoundException("Chat não encontrado."));

        if(chat.getMatch().isFinalizado()){
            throw new MatchFinalizadoException("Falha ao enviar mensagem, match já foi finalizado.");
        }
        
        // 1. Cria a entidade e salva no banco
        BaseMensagem mensagem = mensagemFactory.criarMensagem(chat_id, mensagemDTO);
        BaseMensagem mensagemSalva = mensagemRepository.save(mensagem);
        
        String routingKey =  "user." + mensagemDTO.getDestinatarioId();
        
        // 2. Envia a entidade salva direto pro RabbitMQ (como o seu Consumer já espera)
        rabbitTemplate.convertAndSend(
            RabbitConfig.TOPIC_EXCHANGE_NAME,
            routingKey,
            mensagemSalva
        );

        return new ApiResponse<String>("Mensagem enviada com sucesso.", null);
    }
    @Transactional
    public ApiResponse<String> uploadImagemChat(MultipartFile file, Usuario usuario) {
        try {
            String pastaUploads = "uploads/chat/";
            Path caminhoDiretorio = Paths.get(pastaUploads);

            if (!Files.exists(caminhoDiretorio)) {
                Files.createDirectories(caminhoDiretorio);
            }

            String nomeOriginal = file.getOriginalFilename();
            String extensao = "";
            if (nomeOriginal != null && nomeOriginal.contains(".")) {
                extensao = nomeOriginal.substring(nomeOriginal.lastIndexOf("."));
            }

            String novoNomeArquivo = UUID.randomUUID().toString() + extensao;

            Path caminhoCompleto = caminhoDiretorio.resolve(novoNomeArquivo);
            Files.copy(file.getInputStream(), caminhoCompleto, StandardCopyOption.REPLACE_EXISTING);

            String urlPublica = "http://localhost:8080/imagens/chat/" + novoNomeArquivo;

            return new ApiResponse<>("Upload realizado com sucesso", "url", urlPublica);

        } catch (IOException e) {
            return new ApiResponse<>("Erro ao processar imagem: " + e.getMessage(), null);
        }
    }
}