package br.com.cefet.achadosperdidos.mappers;

import br.com.cefet.achadosperdidos.domain.model.Categoria;
import br.com.cefet.achadosperdidos.dto.categoria.CategoriaDTO;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapper {
    public CategoriaDTO convertToResponseDTO(Categoria categoria){
        CategoriaDTO dto = new CategoriaDTO();
        dto.setId(categoria.getId());
        dto.setNome(categoria.getNome());
        return dto;
    }
}
