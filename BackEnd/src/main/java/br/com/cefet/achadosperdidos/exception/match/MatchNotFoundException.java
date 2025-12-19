package br.com.cefet.achadosperdidos.exception.match;

public class MatchNotFoundException extends RuntimeException {
    public MatchNotFoundException(String message) {
        super(message);
    }
}
