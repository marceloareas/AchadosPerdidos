package br.com.cefet.achadosperdidos.domain.model;

import java.util.Set;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    private String nome;

    @Getter
    @Setter
    private String email;

    @Getter
    @Setter
    private String senha;



    @ManyToMany(mappedBy = "usuarios")
    private Set<Chat> chats = new HashSet<>();

    @OneToMany(mappedBy = "usuario")
    private List<Item> itens = new ArrayList<>();
    
    public Usuario(long id, String nome, String email, String senha){
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }

    public Usuario(){

    }


}
