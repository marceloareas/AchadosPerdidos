package br.com.cefet.achadosperdidos.exception;

import br.com.cefet.achadosperdidos.exception.auth.InvalidCredentials;
import br.com.cefet.achadosperdidos.exception.auth.NotAuthorized;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class AuthExceptionHandler {

    @ExceptionHandler(InvalidCredentials.class)
    public ResponseEntity<Object> handleInvalidCredentialsException(InvalidCredentials e){
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NotAuthorized.class)
    public ResponseEntity<Object> handleNotAuthorizedException(NotAuthorized e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
