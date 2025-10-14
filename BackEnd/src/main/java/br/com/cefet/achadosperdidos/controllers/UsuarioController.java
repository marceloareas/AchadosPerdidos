package br.com.cefet.achadosperdidos.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import br.com.cefet.achadosperdidos.dto.usuario.UsuarioRequestDTO;
import br.com.cefet.achadosperdidos.dto.usuario.UsuarioResponseDTO;
import br.com.cefet.achadosperdidos.services.UsuarioService;


@RestController
@RequestMapping(value="/users")

public class UsuarioController{

    private final UsuarioService usuarioService;

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
