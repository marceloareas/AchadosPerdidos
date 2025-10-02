package br.com.cefet.achadosperdidos.repositories;

import br.com.cefet.achadosperdidos.domain.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>{

}