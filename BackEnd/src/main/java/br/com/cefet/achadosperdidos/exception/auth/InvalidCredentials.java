package br.com.cefet.achadosperdidos.exception.auth;

public class InvalidCredentials extends RuntimeException {
    public InvalidCredentials(String message) {
        super(message);
    }
}
