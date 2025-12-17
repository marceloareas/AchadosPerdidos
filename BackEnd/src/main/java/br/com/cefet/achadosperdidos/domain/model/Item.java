package br.com.cefet.achadosperdidos.domain.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import br.com.cefet.achadosperdidos.domain.enums.TipoItemEnum;
import br.com.cefet.achadosperdidos.domain.enums.StatusItemEnum;


@Entity
@Table(name = "item")
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

    @OneToMany(mappedBy = "itemPerdido", cascade = CascadeType.ALL, orphanRemoval = true)
    private final Set<Match> matches_perdido = new HashSet<>();

    // Um item (achado) pode estar em muitos matches
    @OneToMany(mappedBy = "itemAchado", cascade = CascadeType.ALL, orphanRemoval = true)
    private final Set<Match> matches_achado = new HashSet<>();

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

    public void addMatch(Match match) {
        if (this.tipo == TipoItemEnum.PERDIDO) {
            match.setItemPerdido(this);
            this.matches_perdido.add(match);
        } else if (this.tipo == TipoItemEnum.ACHADO) {
            match.setItemAchado(this);
            this.matches_achado.add(match);
        }
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
