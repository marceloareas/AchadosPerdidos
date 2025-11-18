package br.com.cefet.achadosperdidos.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.cefet.achadosperdidos.domain.model.Chat;

public interface ChatRespository extends JpaRepository<Chat, Long>{
    public Optional<Chat> findByMatchId(Long match_id);
}
