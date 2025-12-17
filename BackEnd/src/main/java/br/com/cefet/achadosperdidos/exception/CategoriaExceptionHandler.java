package br.com.cefet.achadosperdidos.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import br.com.cefet.achadosperdidos.exception.categoria.CategoriaNotFound;

@ControllerAdvice
public class CategoriaExceptionHandler {
    @ExceptionHandler(CategoriaNotFound.class)
    public ResponseEntity<Object> handleUserNotFoundException(CategoriaNotFound exception){
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.NOT_FOUND);
    }

}
