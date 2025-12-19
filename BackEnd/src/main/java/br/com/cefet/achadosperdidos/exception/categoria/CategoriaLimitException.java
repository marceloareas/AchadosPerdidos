package br.com.cefet.achadosperdidos.exception.categoria;

public class CategoriaLimitException extends RuntimeException {
    public CategoriaLimitException(String message) {
        super(message);
    }
}
