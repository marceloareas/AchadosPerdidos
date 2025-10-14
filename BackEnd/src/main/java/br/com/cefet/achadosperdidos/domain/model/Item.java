package br.com.cefet.achadosperdidos.domain.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import br.com.cefet.achadosperdidos.domain.enums.TipoItemEnum;
import br.com.cefet.achadosperdidos.domain.enums.StatusItemEnum;


@Entity
@Table(name = "itens")
@NoArgsConstructor
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @ManyToMany
    @JoinTable(
        name = "item_categoria",
        joinColumns = @JoinColumn(name = "item_id"),
        inverseJoinColumns = @JoinColumn(name = "categoria_id")
    )
    @Getter
    private final Set<Categoria> categorias = new HashSet<>();

    @ManyToMany(mappedBy = "itens")
    @Getter
    private final Set<Match> matches = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    @Getter
    @Setter
    @NotNull
    private Usuario usuario;

    @Getter
    @Setter
    @NotNull
    private String nome;

    @Getter
    @Setter
    @NotNull
    private LocalDateTime dataEvento;

    @Getter
    @Setter
    private LocalDateTime dataDevolucao;

    @Getter
    @Setter
    private LocalDateTime dataCriacao;
    
    @Getter
    @Setter
    @NotNull
    private String descricao;

    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    @NotNull
    private TipoItemEnum tipo;
    
    @Getter
    @Setter
    @Enumerated(EnumType.STRING)
    @NotNull
    private StatusItemEnum status;

    @Getter
    @Setter
    @NotNull
    private String localizacao;

    public void addCategoria(Categoria categoria){
        this.categorias.add(categoria);
        categoria.getItens().add(this);
    }

    public void removerCategoria(Categoria categoria){
        this.categorias.remove(categoria);
        categoria.getItens().remove(this);
    }

    public Item (
            String nome,
            LocalDateTime dataEvento,
            LocalDateTime dataDevolucao,
            LocalDateTime dataCriacao,
            String descricao,
            TipoItemEnum tipo,
            StatusItemEnum status,
            String localizacao
    ){
        this.setNome(nome);
        this.setDataEvento(dataEvento);
        this.setDataCriacao(dataCriacao);
        this.setDataDevolucao(dataDevolucao);
        this.setDescricao(descricao);
        this.setTipo(tipo);
        this.setStatus(status);
        this.setLocalizacao(localizacao);
    }

}
