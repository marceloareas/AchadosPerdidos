package br.com.cefet.achadosperdidos.exception;

import br.com.cefet.achadosperdidos.exception.categoria.CategoriaLimitException;
import br.com.cefet.achadosperdidos.exception.item.ItemNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ItemExceptionHandler {

    @ExceptionHandler(CategoriaLimitException.class)
    public ResponseEntity<Object> handleCategoriaLimitExcepction(CategoriaLimitException e){
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);

    }

    @ExceptionHandler(ItemNotFoundException.class)
    public ResponseEntity<Object> handleItemNotFoundException(ItemNotFoundException e){
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    }
}
