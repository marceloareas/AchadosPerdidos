package br.com.cefet.achadosperdidos.dto.item;

import br.com.cefet.achadosperdidos.domain.enums.StatusItemEnum;
import br.com.cefet.achadosperdidos.domain.enums.TipoItemEnum;
import br.com.cefet.achadosperdidos.domain.model.Categoria;
import br.com.cefet.achadosperdidos.dto.categoria.CategoriaDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ItemResponseDTO {

    private Long id;

    private String nome;

    private String descricao;

    private TipoItemEnum tipo;

    private StatusItemEnum status;

    private String localizacao;

    private CategoriaDTO categoria;
}
