package br.com.cefet.achadosperdidos.repositories;

import br.com.cefet.achadosperdidos.domain.enums.StatusItemEnum;
import br.com.cefet.achadosperdidos.domain.enums.TipoItemEnum;
import br.com.cefet.achadosperdidos.domain.model.Categoria;
import br.com.cefet.achadosperdidos.domain.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findFirst2ByStatusOrderByDataDevolucaoDesc(StatusItemEnum status);
    List<Item> findByUsuarioId(Long userId);
    List<Item> findByTipo(TipoItemEnum tipo);
    List<Item> findByTipoAndUsuario_IdNot(TipoItemEnum tipo, Long usuarioId);

    // Busca itens da mesma categoria
    List<Item> findDistinctByTipoAndUsuario_IdNotAndCategoriasIn(TipoItemEnum tipo, Long usuarioId, Collection<Categoria> categorias);
}
