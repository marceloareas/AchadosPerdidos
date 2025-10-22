package br.com.cefet.achadosperdidos.domain.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "matchs", uniqueConstraints = {
        @UniqueConstraint(name = "UK_match_itens", columnNames = {"item_perdido_id", "item_achado_id"})
})
@NoArgsConstructor
public class Match {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Getter
    @Setter
    @Null
    private boolean confirmacaoPerdido;

    @Getter
    @Setter
    @Null
    private boolean confirmacaoAchado;

    @NotNull
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "item_perdido_id", referencedColumnName = "id")
    @Getter
    @Setter
    private Item itemPerdido;

    @NotNull
    @ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "item_achado_id", referencedColumnName = "id")
    @Getter
    @Setter
    private Item itemAchado;

    @OneToOne(mappedBy = "match", optional = true)
    @Getter
    @Setter
    private Chat chat;

    public Match(Long id, Boolean confirmacaoPerdido, Boolean confirmacaoAchado){
        this.id = id;
        this.confirmacaoPerdido = confirmacaoPerdido;
        this.confirmacaoAchado = confirmacaoAchado;
    }

    
}
