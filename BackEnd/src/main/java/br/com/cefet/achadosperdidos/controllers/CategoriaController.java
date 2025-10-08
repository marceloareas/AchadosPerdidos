package br.com.cefet.achadosperdidos.controllers;

import br.com.cefet.achadosperdidos.dto.categoria.CategoriaResponseDTO;
import br.com.cefet.achadosperdidos.services.CategoriaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/category")

public class CategoriaController{
    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService){
        this.categoriaService = categoriaService;
    }

    @GetMapping
    public ResponseEntity<List<CategoriaResponseDTO>> getAllCategories(){
        List<CategoriaResponseDTO> categorias = categoriaService.findAll();
        return ResponseEntity.ok(categorias);
    }
}