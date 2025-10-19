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
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
public class MatchService {

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
        System.out.println("chegou em findMatches");
        try {
            System.out.println("42");
            Item item = itemRepository.findById(createdItemId)
                    .orElseThrow(() -> new ItemNotFoundException("Item não encontrado"));
            TipoItemEnum tipoItemCriado = item.getTipo();
            System.out.println(43);
            MatchItemDTO itemPivo = convertToMatchItem(item);
            System.out.println(45);
            TipoItemEnum tipoOposto = itemPivo.getTipo() == TipoItemEnum.PERDIDO ? TipoItemEnum.ACHADO : TipoItemEnum.PERDIDO;
            System.out.println(46);
            List<Item> itensTarget = itemRepository.findByTipo(tipoOposto);
            System.out.println(48);
            List<MatchItemDTO> itensTargetDTO = itensTarget.stream().map(this::convertToMatchItem).toList();
            System.out.println(50);

            System.out.println("-> Iniciando busca por matches para o item: " + itemPivo.getNome());
            System.out.println(53);
            MatchRequestDTO requestDTO = new MatchRequestDTO(itemPivo, itensTargetDTO);


            String requestBody = objectMapper.writeValueAsString(requestDTO);
            System.out.println("-> Enviando para match-api:");
            System.out.println(requestBody);

            //CHAMADA REATIVA
            Mono<String> responseMono = webClient.post()
                .uri("http://match-api:5001/llm/match/encontrar")
                .header("X-API-KEY", "2c1f4c46b0a8d8cf4abc3be95bca89a7f76712f54de305d0c2e82b07b4f5c53d")
                .body(Mono.just(requestDTO), MatchRequestDTO.class)
                .retrieve()
                .bodyToMono(String.class)
                .doOnSuccess(response -> System.out.println("<-- resposta da requisicao"))
                .doOnError(error -> System.out.println("<-- Erro ao chamar a API"));

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

        } catch (JsonProcessingException e) {
            System.err.println("Erro ao serializar o corpo da requisição: " + e.getMessage());
        } catch( Exception e) {
            throw new MatchGenericException(e.getMessage());
        }

        return CompletableFuture.completedFuture(null);
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
