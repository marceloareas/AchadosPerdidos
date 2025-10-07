package br.com.cefet.achadosperdidos.services;

import java.util.List;

import br.com.cefet.achadosperdidos.domain.enums.StatusItemEnum;
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
        dto.setEndereco(item.getEndereco());
        dto.setDescricao(item.getDescricao());

        return dto;
    }


}
