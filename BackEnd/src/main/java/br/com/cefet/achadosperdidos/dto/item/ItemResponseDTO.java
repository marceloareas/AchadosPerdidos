package br.com.cefet.achadosperdidos.dto.item;

import br.com.cefet.achadosperdidos.dto.categoria.CategoriaDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ItemResponseDTO extends BaseItemResponseDTO{
    List<CategoriaDTO> categorias;
}
