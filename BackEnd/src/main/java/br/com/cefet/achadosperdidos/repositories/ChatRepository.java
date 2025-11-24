package br.com.cefet.achadosperdidos.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.cefet.achadosperdidos.domain.model.Chat;

import java.util.List;
public interface ChatRepository extends JpaRepository<Chat, Long>{
    Optional<Chat> findByMatchId(Long match_id);
//    public List<Chat> findByUsuarioId(Long userId);
}
