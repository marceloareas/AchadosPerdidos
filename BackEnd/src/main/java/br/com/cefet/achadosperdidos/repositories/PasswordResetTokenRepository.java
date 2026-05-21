package br.com.cefet.achadosperdidos.repositories;

import br.com.cefet.achadosperdidos.domain.model.PasswordResetToken;
import br.com.cefet.achadosperdidos.domain.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUsuario(Usuario usuario);
}