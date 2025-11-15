package br.com.cefet.achadosperdidos.services;

import br.com.cefet.achadosperdidos.domain.enums.TipoItemEnum;
import br.com.cefet.achadosperdidos.domain.model.Categoria;
import br.com.cefet.achadosperdidos.domain.model.Item;
import br.com.cefet.achadosperdidos.domain.model.Match;
import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.dto.match.MatchResponseDTO;
import br.com.cefet.achadosperdidos.dto.match_api_integration.ItemCreatedEvent;
import br.com.cefet.achadosperdidos.dto.match_api_integration.MatchAPIItemDTO;
import br.com.cefet.achadosperdidos.dto.match_api_integration.MatchAPIRequestDTO;
import br.com.cefet.achadosperdidos.dto.match_api_integration.PossibleMatchesResponseDTO;
import br.com.cefet.achadosperdidos.exception.auth.InvalidCredentials;
import br.com.cefet.achadosperdidos.exception.item.ItemNotFoundException;
import br.com.cefet.achadosperdidos.exception.match.MatchGenericException;
import br.com.cefet.achadosperdidos.exception.match.MatchNotFoundException;
import br.com.cefet.achadosperdidos.exception.usuario.UserNotFoundException;
import br.com.cefet.achadosperdidos.mappers.ItemMapper;
import br.com.cefet.achadosperdidos.repositories.ItemRepository;
import br.com.cefet.achadosperdidos.repositories.MatchRepository;

import br.com.cefet.achadosperdidos.repositories.UsuarioRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
public class MatchService {

    @Value("${MATCH_API_KEY}")
    private String MATCH_API_KEY;

    @Autowired
    private WebClient webClient;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MatchPersistenceService matchPersistenceService;

    @Autowired
    private ItemMapper itemMapper;

    public List<MatchResponseDTO> getAllUserMatches(Long userId){
        List<Match> userMatches = matchRepository.findAllByUsuarioId(userId);
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));

        List<MatchResponseDTO> matchResponseDTOList = new ArrayList<MatchResponseDTO>();
        for(Match match : userMatches){
            // Otimizar isso no futuro colocando todas as propriedades dos itens na consulta do SQL.
            Item itemAchado = match.getItemAchado();
            Item itemPerdido = match.getItemPerdido();

            boolean isUsersItemAchado = itemAchado.getUsuario().getId().equals(userId);

            Item itemUsuario = isUsersItemAchado ? itemAchado : itemPerdido;
            Item itemOposto = isUsersItemAchado ? itemPerdido : itemAchado;


            MatchResponseDTO dto = new MatchResponseDTO();
            dto.setId(match.getId());
            dto.setItemUsuario(itemMapper.convertToItemMeusMatchesDTO(itemUsuario));
            dto.setItemOposto(itemMapper.convertToItemMeusMatchesDTO(itemOposto));
            dto.setConfirmacaoItemAchado(match.isConfirmacaoAchado());
            dto.setConfirmacaoItemPerdido(match.isConfirmacaoPerdido());
            matchResponseDTOList.add(dto);
        }
        return matchResponseDTOList;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleItemCreationEvent(ItemCreatedEvent event) {
        System.out.println("Transação comitada. Disparando findMatches para o item: " + event.itemId());
        // Agora sim chamamos o método @Async, com a garantia
        // de que o item já está no banco.
        this.findMatches(event.itemId());
    }

    @Async
    @Transactional
    public CompletableFuture<Void> findMatches(Long createdItemId) {
        try {
            // 1- Achar o item para atuar no objeto managed.
            Item item = itemRepository.findById(createdItemId)
                    .orElseThrow(() -> new ItemNotFoundException("Item não encontrado"));
            TipoItemEnum tipoItemCriado = item.getTipo();

            // Converter item para o tipo de itemPivo (formato da requisição para /llm/match/encontrar em match-api)
            MatchAPIItemDTO itemPivo = convertToMatchItem(item);

            // Obter o tipo oposto do item
            TipoItemEnum tipoOposto = itemPivo.getTipo() == TipoItemEnum.PERDIDO ? TipoItemEnum.ACHADO : TipoItemEnum.PERDIDO;

            // Itens do tipo oposto para comparacao pela LLM
            List<Item> itensTarget = itemRepository.findByTipoAndUsuario_IdNot(tipoOposto, item.getUsuario().getId());

            // Conversao dos itens do tipo oposto para o formato de requisicao para a API de Match
            List<MatchAPIItemDTO> itensTargetDTO = itensTarget.stream().map(this::convertToMatchItem).toList();

            // Criar o DTO para a requisicao.
            MatchAPIRequestDTO requestDTO = new MatchAPIRequestDTO(itemPivo, itensTargetDTO);

            System.out.println("api key:" + MATCH_API_KEY);
            //CHAMADA REATIVA
            Mono<String> responseMono = webClient.post()
                .uri("http://match-api:5001/llm/match/encontrar")
                .header("X-API-KEY", MATCH_API_KEY)
                .body(Mono.just(requestDTO), MatchAPIRequestDTO.class)
                .retrieve()
                .bodyToMono(String.class)
                .doOnSuccess(response -> System.out.println("resposta da requisicao:" + response))
                .doOnError(error -> System.out.println("Erro ao chamar a API:" + error.getMessage()));

            // FLUXO DE PROCESSAMENTO DE MATCHES
            Mono<Void> processingChain = responseMono
                    // Etapa 1: Desserializar
                    .flatMap(this::deserializeResponse)
                    // Etapa 2: Transformar Mono<Lista> em Flux<Item>
                    .flatMapMany(matchesResponse -> Flux.fromIterable(matchesResponse.getMatch_ids()))
                    // Etapa 3: Mover CADA item para uma thread de I/O
                    .publishOn(Schedulers.boundedElastic())
                    // Etapa 4: Salvar CADA item individualmente, tratando falhas
                    .flatMap(itemMatchedId -> this.saveMatchIndividually(itemMatchedId, createdItemId, tipoItemCriado)).then();

            return processingChain.then().toFuture();

        } catch( Exception e) {
            throw new MatchGenericException(e.getMessage());
        }
    }

    @Transactional
    public String deleteMatch(Long matchId,Long userId){
        Match match = matchRepository.findById(matchId).orElseThrow(() -> new MatchNotFoundException("Match não encontrado."));

        Long itemAchadoUsuarioId = match.getItemAchado().getUsuario().getId();
        Long itemPerdidoUsuarioId = match.getItemPerdido().getUsuario().getId();

        if(!Objects.equals(itemAchadoUsuarioId, userId) && !Objects.equals(itemPerdidoUsuarioId, userId)){
            throw new InvalidCredentials("Match não pertence ao usuário");
        }

        matchRepository.delete(match);
        return "Match deletado com sucesso!";
    }

    /**
     * Helper reativo para desserializar a resposta.
     * Falhar aqui irá parar o fluxo.
     */
    private Mono<PossibleMatchesResponseDTO> deserializeResponse(String jsonResponse) {
        try {
            PossibleMatchesResponseDTO matches = objectMapper.readValue(jsonResponse, PossibleMatchesResponseDTO.class);
            return Mono.just(matches);
        } catch (JsonProcessingException e) {
            System.err.println("Erro ao desserializar resposta: " + jsonResponse);
            return Mono.error(new MatchGenericException("Falha ao processar resposta da API" + e.getMessage()));
        }
    }

    /**
     * Helper reativo para salvar um único match.
     * Ele "engole" a exceção para não parar o Flux principal.
     */
    public Mono<Void> saveMatchIndividually(Long itemMatchedId, Long createdItemId, TipoItemEnum tipoItemCriado) {
        return Mono.fromRunnable(() -> {
            try {
                // Chama o método que REALMENTE salva, com sua própria transação
                matchPersistenceService.persistMatch(itemMatchedId, createdItemId, tipoItemCriado);
                System.out.println("-> Match salvo com sucesso: " + itemMatchedId);
            } catch (Exception e) {
                // Se um save falhar (ex: constraint violation),
                // apenas logamos e continuamos.
                System.err.println("-> FALHA ao salvar match " + itemMatchedId + ". Continuando... Erro: " + e.getMessage());
            }
        }).then(); // Converte para Mono<Void> e sinaliza conclusão
    }




    public MatchAPIItemDTO convertToMatchItem(Item item){
            List<String> categorias = item.getCategorias().stream().map(Categoria::getNome).toList();

            MatchAPIItemDTO dto = new MatchAPIItemDTO();
            dto.setId(item.getId());
            dto.setNome(item.getNome());
            dto.setDescricao(item.getDescricao());
            dto.setCategorias(categorias);
            dto.setLocalizacao(item.getLocalizacao());
            dto.setTipo(item.getTipo());

            return dto;
    }
}
