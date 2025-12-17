package br.com.cefet.achadosperdidos.services;

import java.util.List;

import br.com.cefet.achadosperdidos.mappers.CategoriaMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.cefet.achadosperdidos.domain.model.Categoria;
import br.com.cefet.achadosperdidos.dto.categoria.CategoriaDTO;
import br.com.cefet.achadosperdidos.repositories.CategoriaRepository;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaMapper categoriaMapper;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<CategoriaDTO> findAll(){
        List<Categoria> categorias = categoriaRepository.findAll();
        return categorias.stream()
            .map(categoriaMapper::convertToResponseDTO)
            .toList();
    }


}