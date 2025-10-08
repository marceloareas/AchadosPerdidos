package br.com.cefet.achadosperdidos.repositories;
import br.com.cefet.achadosperdidos.domain.model.Categoria;
import  org.springframework.data.jpa.repository.JpaRepository;


public interface CategoriaRepository extends JpaRepository< Categoria, Long> {

}
