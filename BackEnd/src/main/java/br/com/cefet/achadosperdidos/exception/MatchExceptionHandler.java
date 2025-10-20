package br.com.cefet.achadosperdidos.exception;

import br.com.cefet.achadosperdidos.exception.match.MatchGenericException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class MatchExceptionHandler {

    @ExceptionHandler
    public ResponseEntity<String> handleMatchGenericException(MatchGenericException e){
        return new ResponseEntity<String>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }


}
