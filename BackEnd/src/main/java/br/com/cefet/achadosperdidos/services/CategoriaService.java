package br.com.cefet.achadosperdidos.services;

import java.util.List;

import org.springframework.stereotype.Service;

import br.com.cefet.achadosperdidos.domain.model.Categoria;
import br.com.cefet.achadosperdidos.dto.categoria.CategoriaDTO;
import br.com.cefet.achadosperdidos.repositories.CategoriaRepository;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository){
        this.categoriaRepository = categoriaRepository;
    }

    public List<CategoriaDTO> findAll(){
        List<Categoria> categorias = categoriaRepository.findAll();
        return categorias.stream()
            .map(this::convertToResponseDTO)
            .toList();
    }

    public CategoriaDTO convertToResponseDTO(Categoria categoria){
        CategoriaDTO dto = new CategoriaDTO();
        dto.setId(categoria.getId());
        dto.setNome(categoria.getNome());
        return dto;
    }
}