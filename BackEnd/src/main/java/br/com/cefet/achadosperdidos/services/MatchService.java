package br.com.cefet.achadosperdidos.services;

import br.com.cefet.achadosperdidos.domain.model.Item;
import br.com.cefet.achadosperdidos.dto.match.MatchRequestDTO;
import br.com.cefet.achadosperdidos.dto.item.ItemResponseDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class MatchService {

    @Autowired
    private WebClient webClient;

    @Autowired
    private ObjectMapper objectMapper;

    @Async
    public CompletableFuture<Void> findMatches(ItemResponseDTO itemPivo, List<ItemResponseDTO> itensTarget) {
        System.out.println("-> Iniciando busca por matches para o item: " + itemPivo.getNome());

        MatchRequestDTO requestDTO = new MatchRequestDTO(itemPivo, itensTarget);

        try {
            String requestBody = objectMapper.writeValueAsString(requestDTO);
            System.out.println("-> Enviando para match-api:");
            System.out.println(requestBody);

            webClient.post()
                    .uri("/llm/match/encontrar")
                    .header("X-API-KEY", "2c1f4c46b0a8d8cf4abc3be95bca89a7f76712f54de305d0c2e82b07b4f5c53d")
                    .body(Mono.just(requestDTO), MatchRequestDTO.class)
                    .retrieve()
                    .bodyToMono(String.class)
                    .doOnSuccess(response -> {
                        System.out.println("<- Resposta da match-api:");
                        System.out.println(response);
                    })
                    .doOnError(error -> {
                        System.err.println("<- Erro ao chamar a match-api:");
                        System.err.println(error.getMessage());
                    })
                    .subscribe();

        } catch (JsonProcessingException e) {
            System.err.println("Erro ao serializar o corpo da requisição: " + e.getMessage());
        }

        return CompletableFuture.completedFuture(null);
    }
}
