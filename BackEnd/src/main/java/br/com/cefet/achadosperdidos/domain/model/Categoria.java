package br.com.cefet.achadosperdidos.domain.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "categoria")
@NoArgsConstructor
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Getter
    @ManyToMany(mappedBy = "categorias")
    private final Set<Item> itens = new HashSet<>();

    @Getter
    @Setter
    @NotNull
    private String nome;

    public Categoria(Long id, String nome){
        this.id = id;
        this.nome = nome;
    }


}
