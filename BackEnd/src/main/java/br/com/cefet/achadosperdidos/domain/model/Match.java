package br.com.cefet.achadosperdidos.domain.model;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "matchs")
public class Match {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    

    @Getter
    @Setter
    private boolean confirmacaoPerdido;

    @Getter
    @Setter
    private boolean confirmacaoAchado;

    @ManyToMany(cascade =  { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
        name = "match_item",
        joinColumns = @JoinColumn(name = "match_id"),
        inverseJoinColumns = @JoinColumn(name = "item_id")
    )
    @Size(min = 2, max = 2, message = "Um match deve conter dois usuários")
    private Set<Item> itens = new HashSet<>();

    @OneToOne(mappedBy = "match", optional = true)
    private Chat chat;

    

    public Match(Long id, Boolean confirmacaoPerdido, Boolean confirmacaoAchado){
        this.id = id;
        this.confirmacaoPerdido = confirmacaoPerdido;
        this.confirmacaoAchado = confirmacaoAchado;
    }

    
}
