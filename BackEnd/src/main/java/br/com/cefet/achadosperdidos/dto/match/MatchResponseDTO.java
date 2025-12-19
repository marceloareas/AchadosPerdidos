package br.com.cefet.achadosperdidos.dto.match;

import br.com.cefet.achadosperdidos.domain.enums.TipoFinalizacaoMatch;
import br.com.cefet.achadosperdidos.dto.item.ItemMeusMatchesResponseDTO;
import br.com.cefet.achadosperdidos.dto.item.ItemResponseDTO;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MatchResponseDTO {
    private Long id;

    private ItemMeusMatchesResponseDTO itemUsuario;
    private ItemMeusMatchesResponseDTO itemOposto;

    private Boolean arquivadoPorItemPerdido;
    private Boolean arquivadoPorItemAchado;

    private Boolean isFinalizado;
    private TipoFinalizacaoMatch tipoFinalizacaoMatch;
}
