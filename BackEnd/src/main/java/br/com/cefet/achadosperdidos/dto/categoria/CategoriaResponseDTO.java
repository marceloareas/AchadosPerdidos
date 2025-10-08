package br.com.cefet.achadosperdidos.dto.categoria;

import lombok.Getter;
import lombok.Setter;

public class CategoriaResponseDTO {

    public CategoriaResponseDTO(){}

    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private String nome;
}