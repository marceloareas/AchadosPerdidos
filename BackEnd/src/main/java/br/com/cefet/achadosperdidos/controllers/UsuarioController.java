package br.com.cefet.achadosperdidos.controllers;

import java.util.List;

import br.com.cefet.achadosperdidos.domain.model.Usuario;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import br.com.cefet.achadosperdidos.dto.usuario.UsuarioRequestDTO;
import br.com.cefet.achadosperdidos.dto.usuario.UsuarioUpdateRequestDTO;
import br.com.cefet.achadosperdidos.dto.usuario.UsuarioResponseDTO;
import br.com.cefet.achadosperdidos.services.UsuarioService;


@RestController
@RequestMapping(value="/users")

public class UsuarioController{

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService){
        this.usuarioService = usuarioService;
    }


    //TODO: apagar rota de allUsers ( usada apenas para desenvolvimento )
    @GetMapping("/admin")
    public ResponseEntity<List<UsuarioResponseDTO>> getAllUsers() {
        List<UsuarioResponseDTO> usuarios = usuarioService.findAll();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping
    public ResponseEntity<UsuarioResponseDTO> getOneUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario)auth.getPrincipal();
        UsuarioResponseDTO UsuarioAtualizado = usuarioService.findById(usuario.getId());
        return ResponseEntity.ok(UsuarioAtualizado);
    }

    @PatchMapping
    public ResponseEntity<UsuarioResponseDTO> updateUser(@RequestBody UsuarioUpdateRequestDTO usuarioRequestDTO) {
        System.out.println(usuarioRequestDTO);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario)auth.getPrincipal();
        UsuarioResponseDTO usuarioAtualizado = usuarioService.update(usuario.getId(), usuarioRequestDTO);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario)auth.getPrincipal();
        String resposta = usuarioService.delete(usuario.getId());
        return ResponseEntity.ok(resposta);
    }
}
