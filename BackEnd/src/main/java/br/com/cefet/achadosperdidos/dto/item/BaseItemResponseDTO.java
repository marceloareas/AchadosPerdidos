package br.com.cefet.achadosperdidos.dto.item;

import br.com.cefet.achadosperdidos.domain.enums.StatusItemEnum;
import br.com.cefet.achadosperdidos.domain.enums.TipoItemEnum;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class BaseItemResponseDTO {
    private Long id;

    private String nome;

    private String descricao;

    private TipoItemEnum tipo;

    private LocalDateTime dataEvento;

    private StatusItemEnum status;

    private String localizacao;
}
