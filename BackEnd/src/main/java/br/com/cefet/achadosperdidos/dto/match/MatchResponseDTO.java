package br.com.cefet.achadosperdidos.dto.match;

import br.com.cefet.achadosperdidos.dto.item.ItemResponseDTO;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MatchResponseDTO {
    private ItemResponseDTO itemUsuario;
    private ItemResponseDTO itemOposto;

    private Boolean confirmacaoItemPerdido;
    private Boolean confirmacaoItemAchado;
}
