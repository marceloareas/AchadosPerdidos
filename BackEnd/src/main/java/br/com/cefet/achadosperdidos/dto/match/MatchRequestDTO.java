package br.com.cefet.achadosperdidos.dto.match;

import br.com.cefet.achadosperdidos.dto.item.ItemResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MatchRequestDTO {

    private ItemResponseDTO item_pivo;
    
    private List<ItemResponseDTO> itens_target;

}
