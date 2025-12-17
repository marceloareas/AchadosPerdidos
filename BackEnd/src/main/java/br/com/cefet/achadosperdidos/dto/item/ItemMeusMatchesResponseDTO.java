package br.com.cefet.achadosperdidos.dto.item;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ItemMeusMatchesResponseDTO extends ItemResponseDTO {
    private String personName;
}
