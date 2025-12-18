package br.com.cefet.achadosperdidos.domain.model;


import br.com.cefet.achadosperdidos.domain.enums.TipoFinalizacaoMatch;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "match", uniqueConstraints = {
        @UniqueConstraint(name = "UK_match_itens", columnNames = {"item_perdido_id", "item_achado_id"})
})
@NoArgsConstructor
public class Match {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "item_perdido_id", referencedColumnName = "id")
    @Getter
    @Setter
    private Item itemPerdido;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "item_achado_id", referencedColumnName = "id")
    @Getter
    @Setter
    private Item itemAchado;

    @OneToOne(mappedBy = "match", optional = true, cascade = CascadeType.ALL, orphanRemoval = true)
    @Getter
    @Setter
    private Chat chat;

    @Getter
    @Setter
    private boolean arquivadoPorItemPerdido = false;
    @Getter
    @Setter
    private boolean arquivadoPorItemAchado = false;

    @Getter
    @Setter
    @NotNull
    private boolean isFinalizado = false;

    @Getter
    @Setter
    private TipoFinalizacaoMatch tipoFinalizacaoMatch;

    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, orphanRemoval = true)
    @Getter
    private final Set<EventoMudancaStatus> eventosMudancaStatus = new HashSet<EventoMudancaStatus>();

    public Match(Long id, Boolean arquivadoPorItemAchado, Boolean arquivadoPorItemPerdido) {
        this.id = id;
        this.arquivadoPorItemAchado = arquivadoPorItemAchado;
        this.arquivadoPorItemPerdido = arquivadoPorItemPerdido;
    }

    // ver se o match foi arquivado pelo usuario
    public boolean isArquivadoPorUsuario(Long usuarioId) {
        if (itemPerdido.getUsuario().getId().equals(usuarioId)) {
            return arquivadoPorItemPerdido;
        } else if (itemAchado.getUsuario().getId().equals(usuarioId)) {
            return arquivadoPorItemAchado;
        }
        return false;
    }

    // arquivar o match para o usuario
    public void arquivarPorUsuario(Long usuarioId) {
        if (itemPerdido.getUsuario().getId().equals(usuarioId)) {
            this.arquivadoPorItemPerdido = true;
        } else if (itemAchado.getUsuario().getId().equals(usuarioId)) {
            this.arquivadoPorItemAchado = true;
        }
    }
    // desarquivar o match para o usuario
    public void desarquivarPorUsuario(Long usuarioId) {
        if (itemPerdido.getUsuario().getId().equals(usuarioId)) {
            this.arquivadoPorItemPerdido = false;
        } else if (itemAchado.getUsuario().getId().equals(usuarioId)) {
            this.arquivadoPorItemAchado = false;
        }
    }

    public void addEventoMudancaStatus(EventoMudancaStatus eventoMudancaStatus){
        this.eventosMudancaStatus.add(eventoMudancaStatus);
        eventoMudancaStatus.setMatch(this);
    }
    
}
