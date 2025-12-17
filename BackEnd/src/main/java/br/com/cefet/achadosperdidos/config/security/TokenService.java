package br.com.cefet.achadosperdidos.config.security;

//logica de geração e validação dos tokens

import java.time.Duration;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;

import br.com.cefet.achadosperdidos.domain.model.Usuario;

@Service
public class TokenService {

    @Value("${SECRET}")
    private String secret;

    // método para gerar o token
    public String generateToken(Usuario user) {
        try {
            // definir algoritmo
            Algorithm algorithm = Algorithm.HMAC256(secret);
            // gerar token
            
            String token = JWT.create()
                    .withIssuer("AchadosPerdidos")
                    .withSubject("" + user.getId())
                    .withExpiresAt(this.generateExpirationDate())
                    .sign(algorithm);
            return  "Bearer " + token;

        } catch (JWTCreationException e) {
            throw new RuntimeException("Erro ao gerar token");
        }
    }

    // metodo para verificar expiraçao do token
    private Instant generateExpirationDate() {
        return Instant.now().plus(Duration.ofMillis(86400000));
    }

    // metodo para validar o token e retornar o ID do usuário.
    public Long validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            var verifier = JWT.require(algorithm)
                    .withIssuer("AchadosPerdidos")
                    .build();
            var decodedJWT = verifier.verify(token);
            
            return Long.parseLong(decodedJWT.getSubject()); 
        } catch (JWTVerificationException e) {
            return null; // Token inválido
        }
    }

}