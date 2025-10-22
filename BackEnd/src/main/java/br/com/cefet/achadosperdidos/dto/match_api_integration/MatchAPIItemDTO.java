package br.com.cefet.achadosperdidos.dto.match_api_integration;

import br.com.cefet.achadosperdidos.domain.enums.TipoItemEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MatchAPIItemDTO {
    private Long id;
    private String nome;
    private List<String> categorias;
    private String descricao;
    private TipoItemEnum tipo;
    private String localizacao;
}
