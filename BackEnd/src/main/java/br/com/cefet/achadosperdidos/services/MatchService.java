package br.com.cefet.achadosperdidos.services;

import br.com.cefet.achadosperdidos.domain.enums.StatusItemEnum;
import br.com.cefet.achadosperdidos.domain.enums.TipoEventoMudancaStatus;
import br.com.cefet.achadosperdidos.domain.enums.TipoFinalizacaoMatch;
import br.com.cefet.achadosperdidos.domain.enums.TipoItemEnum;
import br.com.cefet.achadosperdidos.domain.model.*;
import br.com.cefet.achadosperdidos.dto.chat.BotaoDTO;
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
import br.com.cefet.achadosperdidos.repositories.EventoMudancaStatusRepository;
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

import java.time.LocalDateTime;
import java.util.*;
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

    @Autowired
    private EventoMudancaStatusRepository eventoMudancaStatusRepository;

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
            dto.setArquivadoPorItemAchado(match.isArquivadoPorItemAchado());
            dto.setArquivadoPorItemPerdido(match.isArquivadoPorItemPerdido());
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
            //List<Item> itensTarget = itemRepository.findByTipoAndUsuario_IdNot(tipoOposto, item.getUsuario().getId());

            List<Item> itensTarget = itemRepository.findDistinctByTipoAndUsuario_IdNotAndCategoriasIn(tipoOposto, item.getUsuario().getId(), item.getCategorias());

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

    // ARQUIVAMENTO DE MATCHS 
    @Transactional
    public void archiveMatch(Long matchId, Long userId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new MatchNotFoundException("Match não encontrado."));

        match.arquivarPorUsuario(userId);
        matchRepository.save(match);
    }  
    
    // CONFIRMAÇÃO DE USUÁRIO NO MATCH

    @Transactional
    public void activateMatch(Long matchId, Long userId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new MatchNotFoundException("Match não encontrado."));

        match.desarquivarPorUsuario(userId);
        matchRepository.save(match);
    }   

    // OBTER MATCHES ATIVOS DO USUARIO
    public List<MatchResponseDTO> getAllActiveUserMaches(Long userd){
        List<Match> userMatches = matchRepository.findAllActiveByUsuarioId(userd);
       List<MatchResponseDTO> matchResponseDTOList = new ArrayList<MatchResponseDTO>();
        for(Match match : userMatches){
            // pula matches arquivados por esse usuario
            if(match.isArquivadoPorUsuario(userd)){
                continue;
            }
            Item itemAchado = match.getItemAchado();
            Item itemPerdido = match.getItemPerdido();

            boolean isUsersItemAchado = itemAchado.getUsuario().getId().equals(userd);

            Item itemUsuario = isUsersItemAchado ? itemAchado : itemPerdido;
            Item itemOposto = isUsersItemAchado ? itemPerdido : itemAchado;

            MatchResponseDTO dto = new MatchResponseDTO();
            dto.setId(match.getId());
            dto.setItemUsuario(itemMapper.convertToItemMeusMatchesDTO(itemUsuario));
            dto.setItemOposto(itemMapper.convertToItemMeusMatchesDTO(itemOposto));
            dto.setArquivadoPorItemAchado(match.isArquivadoPorItemAchado());
            dto.setArquivadoPorItemPerdido(match.isArquivadoPorItemPerdido());
            dto.setIsFinalizado(match.isFinalizado());
            dto.setTipoFinalizacaoMatch(match.getTipoFinalizacaoMatch());
            matchResponseDTOList.add(dto);
        }
        return matchResponseDTOList;
    }

    // OBTER MATCHES ARQUIVADOS DO USUARIO
    public List<MatchResponseDTO> getAllArchivedUserMaches(Long userd){
        List<Match> userMatches = matchRepository.findAllArchivedByUsuarioId(userd);
       List<MatchResponseDTO> matchResponseDTOList = new ArrayList<MatchResponseDTO>();
        for(Match match : userMatches){
            // pula matches nao arquivados por esse usuario
            if(!match.isArquivadoPorUsuario(userd)){
                continue;
            }
            Item itemAchado = match.getItemAchado();
            Item itemPerdido = match.getItemPerdido();

            boolean isUsersItemAchado = itemAchado.getUsuario().getId().equals(userd);

            Item itemUsuario = isUsersItemAchado ? itemAchado : itemPerdido;
            Item itemOposto = isUsersItemAchado ? itemPerdido : itemAchado;

            MatchResponseDTO dto = new MatchResponseDTO();
            dto.setId(match.getId());
            dto.setItemUsuario(itemMapper.convertToItemMeusMatchesDTO(itemUsuario));
            dto.setItemOposto(itemMapper.convertToItemMeusMatchesDTO(itemOposto));
            dto.setArquivadoPorItemAchado(match.isArquivadoPorItemAchado());
            dto.setArquivadoPorItemPerdido(match.isArquivadoPorItemPerdido());
            dto.setIsFinalizado(match.isFinalizado());
            dto.setTipoFinalizacaoMatch(match.getTipoFinalizacaoMatch());
            matchResponseDTOList.add(dto);
        }
        return matchResponseDTOList;
    }

    public BotaoDTO getEstadoParaBotaoNoMatch(Usuario usuario, Long matchId){

        BotaoDTO botaoDTO = new BotaoDTO();
        String nomeBotao = "";
        Boolean isClickable = false;

        Match match = matchRepository.findById(matchId).orElseThrow(() -> new MatchNotFoundException("Match não encontrado."));

        Long userId = usuario.getId();
        System.out.println(userId);
        Usuario itemAchadoUsuario = match.getItemAchado().getUsuario();
        Usuario itemPerdidoUsuario = match.getItemPerdido().getUsuario();
        System.out.println(itemAchadoUsuario.getNome());
        System.out.println(itemPerdidoUsuario.getNome());


        Long itemAchadoUsuarioId = itemAchadoUsuario.getId();
        Long itemPerdidoUsuarioId = itemPerdidoUsuario.getId();

        if(!Objects.equals(itemAchadoUsuarioId, userId) && !Objects.equals(itemPerdidoUsuarioId, userId)){
            throw new InvalidCredentials("Match não pertence ao usuário");
        }

        // verificar de que tipo de item o usuario eh dono.
        boolean isUsuarioDonoItemPerdido = itemPerdidoUsuarioId.equals(usuario.getId());
        boolean isUsuarioDonoItemAchado = itemAchadoUsuarioId.equals(usuario.getId());

        Set<EventoMudancaStatus> eventoMudancaStatusSet = match.getEventosMudancaStatus();

        //se o size for 0, retornar: "Solicitar início de processo de devolução"
        if(eventoMudancaStatusSet.isEmpty()){
             nomeBotao = "Solicitar início de processo de \"Em devolução\"";
             isClickable = true;
        }

        //se o size == 1, avaliar o eventoMudancaStatus (que vai ser de em devolução)
        if(eventoMudancaStatusSet.size() == 1){
            List<EventoMudancaStatus> list = eventoMudancaStatusSet.stream().toList();
            EventoMudancaStatus evento = list.getFirst();

            //todo: tratar casos de:
            // evento criado, mas usuario atual nao confirmou ainda, sendo ele dono do achado ou perdido.

            //se tiver confirmacao de achado e de perdido, retornar "Confirmar de Devolução"
            if(evento.isAchadoConfirmado() && evento.isPerdidoConfirmado()) {
                nomeBotao = "Confirmar devolução";
                isClickable = true;
            }

            if(evento.isPerdidoConfirmado() && isUsuarioDonoItemPerdido && !evento.isAchadoConfirmado()){
                nomeBotao =  "[EM DEVOLUÇÃO] Esperando " + itemAchadoUsuario.getNome().split(" ")[0];
                isClickable = false;
            }

            if(evento.isAchadoConfirmado() && isUsuarioDonoItemAchado && !evento.isPerdidoConfirmado()){
                nomeBotao =  "[EM DEVOLUÇÃO] Esperando " + itemPerdidoUsuario.getNome().split(" ")[0];
                isClickable = false;
            }

            if((evento.isPerdidoConfirmado() && !evento.isAchadoConfirmado() && isUsuarioDonoItemAchado) || 
            evento.isAchadoConfirmado() && !evento.isPerdidoConfirmado() && isUsuarioDonoItemPerdido){
                nomeBotao = "Confirmar início de [EM DEVOLUÇÃO]";
                isClickable = true;
            }
        }

        //se o size == 2, iterar para encontrar o Devolucao

        //se iterar, quer dizer que ele encontrou eventos e preciso olhar para dentro deles para saber o que fazer
        for(EventoMudancaStatus evento : eventoMudancaStatusSet){
            if(evento.getTipoEventoMudancaStatus() == TipoEventoMudancaStatus.DEVOLVIDO){ // evento de devolucao
                //todo: tratar casos de devolucao para:
                // usuario atual nao confirmou mas o outro sim.
                // usuario atual confirmou e o outro nao.

                if(evento.isAchadoConfirmado() && evento.isPerdidoConfirmado()) {
                    nomeBotao = "DEVOLUÇÃO DO ITEM CONFIRMADA!";
                    isClickable = false;
                }

                if(evento.isPerdidoConfirmado() && isUsuarioDonoItemPerdido && !evento.isAchadoConfirmado()){
                    nomeBotao = "[DEVOLUÇÃO] Esperando " + itemAchadoUsuario.getNome().split(" ")[0];
                    isClickable = false;
                }

                if(evento.isAchadoConfirmado() && isUsuarioDonoItemAchado && !evento.isPerdidoConfirmado()){
                    nomeBotao =  "[DEVOLUÇÃO] Esperando " + itemPerdidoUsuario.getNome().split(" ")[0];
                    isClickable = false;
                }

                if((evento.isPerdidoConfirmado() && !evento.isAchadoConfirmado() && isUsuarioDonoItemAchado) || 
                evento.isAchadoConfirmado() && !evento.isPerdidoConfirmado() && isUsuarioDonoItemPerdido){
                    nomeBotao = "Confirmar devolução";
                    isClickable = true;
                }

            }
        }
        botaoDTO.setNomeBotao(nomeBotao);
        botaoDTO.setClickable(isClickable);
        return botaoDTO;
    }

    @Transactional
    public MatchResponseDTO confirmMatchAction(Long matchId, Long userId){
        
        Match match = matchRepository.findById(matchId)
        .orElseThrow(() -> new MatchNotFoundException("Match não encontrado."));
        
        if (match.isFinalizado()) {
            throw new MatchGenericException("Este match já foi encerrado.");
        }

        boolean isUsuarioAchado = match.getItemAchado().getUsuario().getId().equals(userId);
        boolean isUsuarioPerdido = match.getItemPerdido().getUsuario().getId().equals(userId);

        if (!isUsuarioAchado && !isUsuarioPerdido) {
            throw new InvalidCredentials("Usuário não pertence a este match.");
        }        

        Set<EventoMudancaStatus> eventos = match.getEventosMudancaStatus();

        TipoEventoMudancaStatus tipoEvento = descobrirTipoEvento(eventos);        

        // Controle de status do itens. Só pode criar o evento devolvido se os itens estiverem EM_DEVOLUCAO
        if(tipoEvento == TipoEventoMudancaStatus.DEVOLVIDO){
            if(match.getItemAchado().getStatus() != StatusItemEnum.EM_DEVOLUCAO){
                throw new MatchGenericException("Não foi possível finalizar...");
            }
        }

        // Após determinado o tipoEvento a ser tratado, busca-se o registro ou cria-se um novo
        EventoMudancaStatus evento = eventoMudancaStatusRepository
        .findByMatchIdAndTipoEventoMudancaStatus(matchId, tipoEvento)
        .orElse(new EventoMudancaStatus());

        // Se for um novo registro (tupla) na tabela EventoMudancaStatus, uma configuração base é realizada
        if (evento.getId() == null) {
            evento.setMatch(match);
            evento.setTipoEventoMudancaStatus(tipoEvento);
            // Talvez criar algum campo para armazenar datas nos registros
            // AchadoConfirmado e PerdidoConfirmado são false por padrão
        }

        // Confirmação do usuário atual
        if (isUsuarioAchado) {
            evento.setAchadoConfirmado(true);
        } else {
            evento.setPerdidoConfirmado(true);
        }

        // Salvando em BD
        eventoMudancaStatusRepository.save(evento);

        // Se ambos os usuários confirmaram este evento, mudamos o estado real dos itens
        if (evento.isAchadoConfirmado() && evento.isPerdidoConfirmado()) {
            // Essa função é responsável por alterar o status dos itens e aplicar regras de negócio quanto a matchs e chats
            aplicarMudancaDeEstado(match, tipoEvento);
        }

        return new MatchResponseDTO();
    }

    private TipoEventoMudancaStatus descobrirTipoEvento(Set<EventoMudancaStatus> eventos){

        // Ao receber todos os registros (eventos) associados ao match passado, busca-se se já existe um evento de EM_DEVOLUCAO
        Optional<EventoMudancaStatus> eventoEmDevolucaoOpt = eventos.stream()
        .filter(e -> e.getTipoEventoMudancaStatus() == TipoEventoMudancaStatus.EM_DEVOLUCAO)
        .findFirst();

        // Verifica se foi encontrado algum evento do tipo EM_DEVOLUCAO
        if(eventoEmDevolucaoOpt.isEmpty()){
            // Se não existir nenhum registro do tipo EM_DEVOLUCAO, o tipo EM_DEVOLUCAO é retornado
            // Simboliza que estamos querendo gerar o primeiro registro para aquele match
            return TipoEventoMudancaStatus.EM_DEVOLUCAO;
        }
        else{
            // Capturando o registro de EM_DEVOLUCAO encontrado
            EventoMudancaStatus emDevolucao = eventoEmDevolucaoOpt.get();
            // Se já existe algum registro do tipo EM_DEVOLUCAO, verifica-se se os usuários já confirmaram a devolução
            if(emDevolucao.isAchadoConfirmado() && emDevolucao.isPerdidoConfirmado()){
                // Se ambos já confirmaram o processo de EM_DEVOLUCAO, o próximo passo é iniciar a conclusão (DEVOLVIDO)
                return TipoEventoMudancaStatus.DEVOLVIDO;
            }
            else{
                // Caso ainda falte a aprovação de algum usuário, o status continua o mesmo
                return TipoEventoMudancaStatus.EM_DEVOLUCAO;
            }
        }
    }

    private void aplicarMudancaDeEstado(Match match, TipoEventoMudancaStatus tipoEvento) {
        if (tipoEvento == TipoEventoMudancaStatus.EM_DEVOLUCAO) {
            // Ambos aceitaram iniciar a devolução, mudamos os status dos itens para EM_DEVOLUCAO
            atualizarItens(match, StatusItemEnum.EM_DEVOLUCAO);

        } else if (tipoEvento == TipoEventoMudancaStatus.DEVOLVIDO) {
            // Ambos confirmaram que receberam/entregaram, mudamos status para RECUPERADO
            atualizarItens(match, StatusItemEnum.RECUPERADO);
            
            // Encerra o Match atual
            match.setFinalizado(true);
            match.setTipoFinalizacaoMatch(TipoFinalizacaoMatch.CONCLUSAO_MATCH);
            matchRepository.save(match);

            // para o caso de conclusão de match, encerrar todos os concorrentes.
            encerrarMatchesConcorrentes(match);
        }
    }

    private void atualizarItens(Match match, StatusItemEnum novoStatus) {
        Item achado = match.getItemAchado();
        Item perdido = match.getItemPerdido();
        achado.setStatus(novoStatus);
        perdido.setStatus(novoStatus);
        
        if(novoStatus == StatusItemEnum.RECUPERADO) {
            LocalDateTime agora = LocalDateTime.now();
            achado.setDataDevolucao(agora);
            perdido.setDataDevolucao(agora);
        }
        
        itemRepository.save(achado);
        itemRepository.save(perdido);
    }


    private void encerrarMatchesConcorrentes(Match matchPrincipal){
        Long itemAchadoId = matchPrincipal.getItemAchado().getId();
        Long itemPerdidoId = matchPrincipal.getItemPerdido().getId();

        // Busca matches onde o item achado está envolvido
        List<Match> matchesComItemAchado = matchRepository.findByItemAchado_Id(itemAchadoId);
        // Busca matches onde o item perdido está envolvido
        List<Match> matchesComItemPerdido = matchRepository.findByItemPerdido_Id(itemPerdidoId);

        // Usa um Set para evitar duplicatas caso haja intersecção
        Set<Match> matchesParaEncerrar = new HashSet<>(matchesComItemAchado);
        matchesParaEncerrar.addAll(matchesComItemPerdido);

        for (Match m : matchesParaEncerrar) {
            // Pula o match que acabou de ser concluído com sucesso
            if (m.getId().equals(matchPrincipal.getId())) {
                continue;
            }

            // Se o match ainda estiver aberto, encerra
            if (!m.isFinalizado()) {
                m.setFinalizado(true);
                m.setTipoFinalizacaoMatch(TipoFinalizacaoMatch.CONCLUSAO_OUTRO_MATCH);
                matchRepository.save(m);
            }
        }
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
