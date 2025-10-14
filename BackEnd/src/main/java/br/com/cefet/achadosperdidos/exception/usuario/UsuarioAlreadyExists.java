package br.com.cefet.achadosperdidos.exception.usuario;

public class UsuarioAlreadyExists extends RuntimeException {
    public UsuarioAlreadyExists(String message) {
        super(message);
    }
}
