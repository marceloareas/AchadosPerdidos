package br.com.cefet.achadosperdidos.repositories;

import br.com.cefet.achadosperdidos.domain.model.Match;
import br.com.cefet.achadosperdidos.dto.match.MatchResponseDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {
    Optional<Match> findByItemPerdido_IdAndItemAchado_Id(Long perdidoId, Long achadoId);
    List<Match> findByItemPerdido_Id(Long perdidoId);
    List<Match> findByItemAchado_Id(Long achadoId);

    @Query("SELECT m FROM Match m WHERE m.itemAchado.usuario.id = :userId OR m.itemPerdido.usuario.id = :userId")
    List<Match> findAllByUsuarioId(@Param("userId") Long userId);

    @Query("SELECT m FROM Match m WHERE (m.itemPerdido.usuario.id = :userId AND m.arquivadoPorItemPerdido = false) OR (m.itemAchado.usuario.id = :userId AND m.arquivadoPorItemAchado = false)")
    List<Match> findAllActiveByUsuarioId(@Param("userId") Long userId);         
    
    @Query("SELECT m FROM Match m WHERE (m.itemPerdido.usuario.id = :userId AND m.arquivadoPorItemPerdido = true) OR (m.itemAchado.usuario.id = :userId AND m.arquivadoPorItemAchado = true)")
    List<Match> findAllArchivedByUsuarioId(@Param("userId") Long userId);
}
