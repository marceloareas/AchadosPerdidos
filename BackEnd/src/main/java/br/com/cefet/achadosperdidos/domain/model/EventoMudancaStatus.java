package br.com.cefet.achadosperdidos.domain.model;

import br.com.cefet.achadosperdidos.domain.enums.TipoEventoMudancaStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "eventoMudancaStatus")
@NoArgsConstructor
public class EventoMudancaStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Getter
    @Setter
    private boolean isAchadoConfirmado;

    @Getter
    @Setter
    private boolean isPerdidoConfirmado;

    @Getter
    @Setter
    private TipoEventoMudancaStatus tipoEventoMudancaStatus;

    @ManyToOne
    @JoinColumn(name = "match_id", referencedColumnName = "id")
    @Getter
    @Setter
    @NotNull
    private Match match;
}
