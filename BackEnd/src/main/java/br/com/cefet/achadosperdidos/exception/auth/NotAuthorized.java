package br.com.cefet.achadosperdidos.exception.auth;

public class NotAuthorized extends RuntimeException {
    public NotAuthorized(String message) {
        super(message);
    }
}
