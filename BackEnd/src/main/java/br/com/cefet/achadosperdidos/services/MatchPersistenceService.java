package br.com.cefet.achadosperdidos.services;

import br.com.cefet.achadosperdidos.domain.enums.TipoItemEnum;
import br.com.cefet.achadosperdidos.domain.model.Match;
import br.com.cefet.achadosperdidos.repositories.ItemRepository;
import br.com.cefet.achadosperdidos.repositories.MatchRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;

import java.util.Optional;

@Service
public class MatchPersistenceService {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private ItemRepository itemRepository; // Assumindo que você precisa buscar os itens

    /**
     * Este é o método que faz o trabalho de banco de dados.
     * Ele PRECISA de Propagation.REQUIRES_NEW para garantir
     * que cada save seja uma transação nova e independente.
     *
     * IMPORTANTE: Para isso funcionar, ele deve ser chamado
     * a partir de uma referência externa (por isso o `self.persistMatch`).
     */
    @Transactional(Transactional.TxType.REQUIRES_NEW)
    public void persistMatch(Long itemMatchedId, Long createdItemId, TipoItemEnum tipoItemCriado) {
        Long itemAchadoId;
        Long itemPerdidoId;
        if(tipoItemCriado == TipoItemEnum.ACHADO){
            itemAchadoId = createdItemId;
            itemPerdidoId = itemMatchedId;
        }else{
            itemAchadoId = itemMatchedId;
            itemPerdidoId = createdItemId;
        }

        Optional<Match> matchOptional = matchRepository.findByItemPerdido_IdAndItemAchado_Id(itemPerdidoId, itemAchadoId);

        if(matchOptional.isEmpty()){
            Match match = new Match();
            match.setItemAchado(itemRepository.findById(itemAchadoId).orElse(null));
            match.setItemPerdido(itemRepository.findById(itemPerdidoId).orElse(null));
            match.setConfirmacaoAchado(false);
            match.setConfirmacaoPerdido(false);
            match.setArquivadoPorItemPerdido(false);
            match.setArquivadoPorItemAchado(false);

            matchRepository.save(match);
        }
    }
}