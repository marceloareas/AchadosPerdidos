package br.com.cefet.achadosperdidos.dto.match;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
@AllArgsConstructor
@ToString
public class MatchesResponseDTO {
    @JsonProperty("id_ItemPivo")
    private Long target_id;

    @JsonProperty("ids_PossiveisMatches")
    private List<Long> match_ids;

    @JsonProperty("notas_PossiveisMatches")
    private List<Double> match_notas;

    public Map<Long, Double> getMatchMap(){
        Map<Long, Double> map = new HashMap<Long, Double>();
        if(match_ids != null && match_notas != null){
            for(int i = 0; i < match_ids.size(); i++) {
                map.put(match_ids.get(i), match_notas.get(i));
            }
        }
        return map;
    }
}
