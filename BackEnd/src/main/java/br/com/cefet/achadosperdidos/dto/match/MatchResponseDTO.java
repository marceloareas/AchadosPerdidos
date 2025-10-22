package br.com.cefet.achadosperdidos.dto.match;

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

    private Boolean confirmacaoItemPerdido;
    private Boolean confirmacaoItemAchado;
}
