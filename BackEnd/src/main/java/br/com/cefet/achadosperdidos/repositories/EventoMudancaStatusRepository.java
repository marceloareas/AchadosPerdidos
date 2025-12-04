package br.com.cefet.achadosperdidos.repositories;

import br.com.cefet.achadosperdidos.domain.enums.TipoEventoMudancaStatus;
import br.com.cefet.achadosperdidos.domain.model.EventoMudancaStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventoMudancaStatusRepository extends JpaRepository<EventoMudancaStatus, Long> {
    List<EventoMudancaStatus> findByMatchId(Long matchId);
    Optional<EventoMudancaStatus> findByMatchIdAndTipoEventoMudancaStatus(Long matchId, TipoEventoMudancaStatus tipo);
}
