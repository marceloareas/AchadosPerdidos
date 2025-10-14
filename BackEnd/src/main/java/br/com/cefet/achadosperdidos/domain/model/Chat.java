package br.com.cefet.achadosperdidos.domain.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import lombok.NoArgsConstructor;


@Entity
@Table(name = "chats")
@NoArgsConstructor
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name = "match_id", referencedColumnName = "id")
    private Match match;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
        name = "usuario_chat",
        joinColumns = @JoinColumn(name = "chat_id"),
        inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private final List<Usuario> usuarios = new ArrayList<>();

    public Chat(Long id){
        this.id = id;
    }


}
