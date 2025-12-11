package br.com.cefet.achadosperdidos.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import br.com.cefet.achadosperdidos.exception.chat.ChatNotFoundException;

@ControllerAdvice
public class ChatExceptionHandler {
    
    @ExceptionHandler(ChatNotFoundException.class)
    public ResponseEntity<Object> handleChatNotFoundException(ChatNotFoundException e){
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    }

}
