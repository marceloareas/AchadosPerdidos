package br.com.cefet.achadosperdidos.repositories;

import br.com.cefet.achadosperdidos.domain.enums.StatusItemEnum;
import br.com.cefet.achadosperdidos.domain.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findFirst2ByStatusOrderByDataDevolucaoDesc(StatusItemEnum status);
}
