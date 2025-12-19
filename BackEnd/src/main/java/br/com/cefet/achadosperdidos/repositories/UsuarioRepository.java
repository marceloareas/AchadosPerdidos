package br.com.cefet.achadosperdidos.repositories;

import br.com.cefet.achadosperdidos.domain.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
    Optional<Usuario> findByEmail(String email);
    Boolean existsByEmail(String email);
}