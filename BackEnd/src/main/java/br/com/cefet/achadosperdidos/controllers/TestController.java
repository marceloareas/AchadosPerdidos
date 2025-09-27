package br.com.cefet.achadosperdidos.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/test")
public class TestController {
    @GetMapping
    public ResponseEntity<String> getMethodName() {
        return ResponseEntity.ok("hi there");
    }
    
}
