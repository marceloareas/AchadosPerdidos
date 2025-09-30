package br.com.cefet.achadosperdidos.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.Id;

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
    
    public Usuario(long id, String nome, String email, String senha){
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }

    public Usuario(){

    }


}
