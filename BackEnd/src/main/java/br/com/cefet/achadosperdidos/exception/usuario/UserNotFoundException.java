package br.com.cefet.achadosperdidos.exception.usuario;

public class UserNotFoundException extends RuntimeException{
    public UserNotFoundException(String message){
        super(message);
    }
}