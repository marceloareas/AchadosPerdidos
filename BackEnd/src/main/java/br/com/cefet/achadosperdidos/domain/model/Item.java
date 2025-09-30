package br.com.cefet.achadosperdidos.domain.model;

import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import br.com.cefet.achadosperdidos.domain.enums.TipoItemEnum;
import br.com.cefet.achadosperdidos.domain.enums.StatusItemEnum;


@Entity
@Table(name = "itens")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    @JoinTable(
        name = "item_categoria",
        joinColumns = @JoinColumn(name = "item_id"),
        inverseJoinColumns = @JoinColumn(name = "categoria_id")
    )
    private Set<Categoria> categorias = new HashSet<>();

    @Getter
    @Setter
    private String nome;

    @Getter
    @Setter
    private LocalDateTime data;
    
    @Getter
    @Setter
    private String descricao;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    private TipoItemEnum tipo;
    
    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    private StatusItemEnum status;

    @Getter
    @Setter
    private String endereco;

}
