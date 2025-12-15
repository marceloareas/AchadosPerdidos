package br.com.cefet.achadosperdidos.exception.chat;

public class ChatNotFoundException extends RuntimeException{
    public ChatNotFoundException(String message){
        super(message);
    }
}
