package br.com.cefet.achadosperdidos.controllers;

import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import br.com.cefet.achadosperdidos.dto.usuario.UsuarioRequestDTO;
import br.com.cefet.achadosperdidos.dto.usuario.UsuarioResponseDTO;
import br.com.cefet.achadosperdidos.services.UsuarioService;
import br.com.cefet.achadosperdidos.domain.model.Usuario;


@RestController
@RequestMapping(value="/users")
public class UsuarioController{

    private UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService){
        this.usuarioService = usuarioService;
    }

    
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> getAllUsers() {
        List<UsuarioResponseDTO> usuarios = usuarioService.findAll();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> getOneUser(@PathVariable Long id) {
        UsuarioResponseDTO usuario = usuarioService.findById(id);
        return ResponseEntity.ok(usuario);
    }
    
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> createUser(@RequestBody UsuarioRequestDTO usuarioRequestDTO){
        UsuarioResponseDTO usuarioCriado = usuarioService.create(usuarioRequestDTO);
        return new ResponseEntity<>(usuarioCriado, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> updateUser(@PathVariable Long id, @RequestBody UsuarioRequestDTO usuarioRequestDTO) {
        UsuarioResponseDTO usuarioAtualizado = usuarioService.update(id, usuarioRequestDTO);
        return ResponseEntity.ok(usuarioAtualizado);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
