package br.com.cefet.achadosperdidos.dto.item;

import br.com.cefet.achadosperdidos.dto.categoria.CategoriaDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ItemRecentementeRetornadoResponseDTO extends BaseItemResponseDTO {
    private CategoriaDTO categoria;
}
