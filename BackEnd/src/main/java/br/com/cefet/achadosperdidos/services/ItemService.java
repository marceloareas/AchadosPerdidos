package br.com.cefet.achadosperdidos.services;

import java.util.List;
import java.util.Optional;

import br.com.cefet.achadosperdidos.domain.enums.StatusItemEnum;
import br.com.cefet.achadosperdidos.domain.model.Categoria;
import br.com.cefet.achadosperdidos.dto.categoria.CategoriaDTO;
import org.springframework.stereotype.Service;

import br.com.cefet.achadosperdidos.domain.model.Item;
import br.com.cefet.achadosperdidos.dto.item.ItemResponseDTO;
import br.com.cefet.achadosperdidos.repositories.ItemRepository;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository){
        this.itemRepository = itemRepository;
    }

    public List<ItemResponseDTO> getRecentItensReturned(){
        List<Item> mostRecentItens = this.itemRepository.findFirst2ByStatusOrderByDataDesc(StatusItemEnum.RECUPERADO);

        return mostRecentItens.stream()
                .map(this::convertToDTO)
                .toList();
    }


    public ItemResponseDTO convertToDTO(Item item){
        ItemResponseDTO dto = new ItemResponseDTO();
        dto.setId(item.getId());
        dto.setTipo(item.getTipo());
        dto.setNome(item.getNome());
        dto.setStatus(item.getStatus());
        dto.setLocalizacao(item.getLocalizacao());
        dto.setDescricao(item.getDescricao());
        Optional<Categoria> categoriaOptional = item.getCategorias().stream().findFirst();

        categoriaOptional.ifPresent(categoria -> {
            CategoriaDTO categoriaDTO = new CategoriaDTO();
            categoriaDTO.setId(categoria.getId());
            categoriaDTO.setNome(categoria.getNome());
            dto.setCategoria(categoriaDTO);
        });

        return dto;
    }


}
