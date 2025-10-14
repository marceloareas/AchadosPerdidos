package br.com.cefet.achadosperdidos.services;

import java.util.List;

import br.com.cefet.achadosperdidos.exception.auth.InvalidCredentials;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.repositories.UsuarioRepository;
import br.com.cefet.achadosperdidos.dto.usuario.UsuarioResponseDTO;
import br.com.cefet.achadosperdidos.dto.usuario.UsuarioRequestDTO;
import br.com.cefet.achadosperdidos.exception.usuario.UserNotFoundException;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
        UsuarioRepository usuarioRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
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

    public UsuarioResponseDTO create(UsuarioRequestDTO usuarioRequestDTO){
        Usuario novoUsuario = new Usuario();

        novoUsuario.setNome(usuarioRequestDTO.getNome());

        Boolean alreadyExists = usuarioRepository.existsByEmail(usuarioRequestDTO.getEmail());

        if(alreadyExists){
            throw new InvalidCredentials("Ocorreu um erro ao realizar Login.");
        }

        //todo: verificar se o email é valido para registrar. -> throw error se não.
        novoUsuario.setEmail(usuarioRequestDTO.getEmail());
        
        // CRIPTOGRAFIA
        String hashedSenha = passwordEncoder.encode(usuarioRequestDTO.getSenha());
        novoUsuario.setSenha(hashedSenha);
        
        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);
        return convertToResponseDTO(usuarioSalvo);
    }

    public UsuarioResponseDTO update(Long id, UsuarioRequestDTO usuarioRequestDTO){
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));

        usuario.setNome(usuarioRequestDTO.getNome());

        //todo: verificar se o email é valido para atualizar. throw error se não.
        usuario.setEmail(usuarioRequestDTO.getEmail());

        // CRIPTOGRAFIA
        if (usuarioRequestDTO.getSenha() != null && !usuarioRequestDTO.getSenha().isEmpty()) {
            usuario.setSenha(passwordEncoder.encode(usuarioRequestDTO.getSenha()));
        }

        Usuario usuarioAtualizado = usuarioRepository.save(usuario);
        return convertToResponseDTO(usuarioAtualizado);
    }

    public void delete(Long id){
        
        if(!usuarioRepository.existsById(id)){
            throw new UserNotFoundException("Usuário não encontrado");
        }

        usuarioRepository.deleteById(id);
    }

    public UsuarioResponseDTO convertToResponseDTO(Usuario usuario){
        UsuarioResponseDTO dto = new UsuarioResponseDTO();

        dto.setId(usuario.getId());
        dto.setEmail(usuario.getEmail());
        dto.setNome(usuario.getNome());

        return dto;
    }
}
