package br.com.cefet.achadosperdidos.services;

import br.com.cefet.achadosperdidos.domain.enums.TipoItemEnum;
import br.com.cefet.achadosperdidos.domain.model.Categoria;
import br.com.cefet.achadosperdidos.domain.model.Item;
import br.com.cefet.achadosperdidos.domain.model.Match;
import br.com.cefet.achadosperdidos.dto.match.ItemCreatedEvent;
import br.com.cefet.achadosperdidos.dto.match.MatchItemDTO;
import br.com.cefet.achadosperdidos.dto.match.MatchRequestDTO;
import br.com.cefet.achadosperdidos.dto.match.MatchesResponseDTO;
import br.com.cefet.achadosperdidos.exception.item.ItemNotFoundException;
import br.com.cefet.achadosperdidos.exception.match.MatchGenericException;
import br.com.cefet.achadosperdidos.repositories.ItemRepository;
import br.com.cefet.achadosperdidos.repositories.MatchRepository;

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

import java.util.List;
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
    private MatchPersistenceService matchPersistenceService;

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
            MatchItemDTO itemPivo = convertToMatchItem(item);

            // Obter o tipo oposto do item
            TipoItemEnum tipoOposto = itemPivo.getTipo() == TipoItemEnum.PERDIDO ? TipoItemEnum.ACHADO : TipoItemEnum.PERDIDO;

            // Itens do tipo oposto para comparacao pela LLM
            List<Item> itensTarget = itemRepository.findByTipoAndUsuario_IdNot(tipoOposto, item.getUsuario().getId());

            // Conversao dos itens do tipo oposto para o formato de requisicao para a API de Match
            List<MatchItemDTO> itensTargetDTO = itensTarget.stream().map(this::convertToMatchItem).toList();

            // Criar o DTO para a requisicao.
            MatchRequestDTO requestDTO = new MatchRequestDTO(itemPivo, itensTargetDTO);

            System.out.println("api key:" + MATCH_API_KEY);
            //CHAMADA REATIVA
            Mono<String> responseMono = webClient.post()
                .uri("http://match-api:5001/llm/match/encontrar")
                .header("X-API-KEY", MATCH_API_KEY)
                .body(Mono.just(requestDTO), MatchRequestDTO.class)
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

    /**
     * Helper reativo para desserializar a resposta.
     * Falhar aqui irá parar o fluxo.
     */
    private Mono<MatchesResponseDTO> deserializeResponse(String jsonResponse) {
        try {
            MatchesResponseDTO matches = objectMapper.readValue(jsonResponse, MatchesResponseDTO.class);
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




    public MatchItemDTO convertToMatchItem(Item item){
            List<String> categorias = item.getCategorias().stream().map(Categoria::getNome).toList();

            MatchItemDTO dto = new MatchItemDTO();
            dto.setId(item.getId());
            dto.setNome(item.getNome());
            dto.setDescricao(item.getDescricao());
            dto.setCategorias(categorias);
            dto.setLocalizacao(item.getLocalizacao());
            dto.setTipo(item.getTipo());

            return dto;
    }
}
