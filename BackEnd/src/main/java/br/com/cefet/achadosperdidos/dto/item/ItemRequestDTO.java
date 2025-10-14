package br.com.cefet.achadosperdidos.dto.item;

import java.time.LocalDateTime;
import java.util.List;

import br.com.cefet.achadosperdidos.domain.enums.TipoItemEnum;
import br.com.cefet.achadosperdidos.dto.categoria.CategoriaDTO;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ItemRequestDTO {
    // String nome
    // TipoItemEnum
    // List de categoria
    // String localizacao
    // String descricao
    // DataEvento
    // DataCriacao (sera criado dentro Item) -> será iniciado dentro do service como LocalDateTime da data atual.
    // DataDevolucao (inicialmente null). -> será iniciado dentro do service como null
    // StatusItemEnum status -> (será iniciado dentro do service como Matching).

    private String nome;
    private TipoItemEnum tipo;
    private String descricao;
    private List<CategoriaDTO> categorias;
    private String localizacao;
    private LocalDateTime dataEvento;

}
