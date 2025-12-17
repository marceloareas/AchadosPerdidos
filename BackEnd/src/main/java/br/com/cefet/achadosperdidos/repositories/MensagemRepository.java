package br.com.cefet.achadosperdidos.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import br.com.cefet.achadosperdidos.domain.model.BaseMensagem;

public interface MensagemRepository extends MongoRepository<BaseMensagem, String>{
    List<BaseMensagem> findByChatIdOrderByDataEnvioAsc(Long chatId);
}
