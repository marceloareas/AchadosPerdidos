package br.com.cefet.achadosperdidos.dto.match_api_integration;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MatchAPIRequestDTO {

    private MatchAPIItemDTO item_pivo;
    
    private List<MatchAPIItemDTO> itens_target;

}
