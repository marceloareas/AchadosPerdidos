package br.com.cefet.achadosperdidos.dto.item;

import br.com.cefet.achadosperdidos.domain.enums.StatusItemEnum;
import br.com.cefet.achadosperdidos.domain.enums.TipoItemEnum;
import lombok.Getter;
import lombok.Setter;

public class ItemResponseDTO {

    public ItemResponseDTO(){}

    @Getter
    @Setter
    private Long id;

    @Getter
    @Setter
    private String nome;

    @Getter
    @Setter
    private String descricao;

    @Getter
    @Setter
    private TipoItemEnum tipo;

    @Getter
    @Setter
    private StatusItemEnum status;

    @Getter
    @Setter
    private String endereco;
}
