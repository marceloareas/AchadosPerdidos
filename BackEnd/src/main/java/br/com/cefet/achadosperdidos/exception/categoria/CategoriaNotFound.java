package br.com.cefet.achadosperdidos.exception.categoria;

public class CategoriaNotFound extends RuntimeException {
    public CategoriaNotFound(String message) {
        super(message);
    }
}
