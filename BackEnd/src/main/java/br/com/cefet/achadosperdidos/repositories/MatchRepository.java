package br.com.cefet.achadosperdidos.repositories;

import br.com.cefet.achadosperdidos.domain.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {
    Optional<Match> findByItemPerdido_IdAndItemAchado_Id(Long perdidoId, Long achadoId);
    List<Match> findByItemPerdido_Id(Long perdidoId);
    List<Match> findByItemAchado_Id(Long achadoId);
}
