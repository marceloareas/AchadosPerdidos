package br.com.cefet.achadosperdidos.mappers;

import br.com.cefet.achadosperdidos.domain.model.Categoria;
import br.com.cefet.achadosperdidos.domain.model.Item;
import br.com.cefet.achadosperdidos.dto.categoria.CategoriaDTO;
import br.com.cefet.achadosperdidos.dto.item.ItemRecentementeRetornadoResponseDTO;
import br.com.cefet.achadosperdidos.dto.item.ItemResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class ItemMapper {

    @Autowired
    private CategoriaMapper categoriaMapper;

    public ItemResponseDTO convertToDTO(Item item){
        ItemResponseDTO dto = new ItemResponseDTO();
        dto.setId(item.getId());
        dto.setTipo(item.getTipo());
        dto.setNome(item.getNome());
        dto.setStatus(item.getStatus());
        dto.setLocalizacao(item.getLocalizacao());
        dto.setDescricao(item.getDescricao());
        dto.setDataEvento(item.getDataEvento());
        List<CategoriaDTO> categorias = item.getCategorias().stream().map(categoriaMapper::convertToResponseDTO).toList();
        dto.setCategorias(categorias);

        return dto;
    }

    public ItemRecentementeRetornadoResponseDTO convertToRecentlyReturnedDTO(Item item){
        ItemRecentementeRetornadoResponseDTO dto = new ItemRecentementeRetornadoResponseDTO();
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
