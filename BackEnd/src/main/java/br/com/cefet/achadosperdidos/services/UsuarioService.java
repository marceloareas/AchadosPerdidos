package br.com.cefet.achadosperdidos.services;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.repositories.UsuarioRepository;
import br.com.cefet.achadosperdidos.dto.usuario.UsuarioResponseDTO;
import br.com.cefet.achadosperdidos.exception.usuario.UserNotFoundException;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(
        UsuarioRepository usuarioRepository
    ) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<UsuarioResponseDTO> findAll(){
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream()
            .map(this::convertToResponseDTO)
            .toList();
    }

    public UsuarioResponseDTO findById(Long id){
        return usuarioRepository.findById(id)
            .map(this::convertToResponseDTO)
            .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));
    }

    public UsuarioResponseDTO convertToResponseDTO(Usuario usuario){
        UsuarioResponseDTO dto = new UsuarioResponseDTO();

        dto.setId(usuario.getId());
        dto.setEmail(usuario.getEmail());
        dto.setNome(usuario.getNome());

        return dto;
    }
}
