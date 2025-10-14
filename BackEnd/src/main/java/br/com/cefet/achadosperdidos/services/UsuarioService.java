package br.com.cefet.achadosperdidos.services;

import java.util.List;

import br.com.cefet.achadosperdidos.exception.auth.InvalidCredentials;
import br.com.cefet.achadosperdidos.exception.usuario.UsuarioAlreadyExists;
import jakarta.transaction.Transactional;
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

    @Transactional
    public UsuarioResponseDTO create(UsuarioRequestDTO usuarioRequestDTO){
        Usuario novoUsuario = new Usuario();

        novoUsuario.setNome(usuarioRequestDTO.getNome());

        Boolean alreadyExists = usuarioRepository.existsByEmail(usuarioRequestDTO.getEmail());

        if(alreadyExists){
            throw new UsuarioAlreadyExists("Email já cadastrado.");
        }

        //todo: verificar se o email é valido para registrar. -> throw error se não.
        novoUsuario.setEmail(usuarioRequestDTO.getEmail());
        
        // CRIPTOGRAFIA
        String hashedSenha = passwordEncoder.encode(usuarioRequestDTO.getSenha());
        novoUsuario.setSenha(hashedSenha);
        
        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);
        return convertToResponseDTO(usuarioSalvo);
    }

    @Transactional
    public UsuarioResponseDTO update(Long id, UsuarioRequestDTO usuarioRequestDTO){
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));

        if(usuarioRequestDTO.getNome() != null && !usuarioRequestDTO.getNome().equals(usuario.getNome()))
            usuario.setNome(usuarioRequestDTO.getNome());

        //todo: verificar se o email é valido para atualizar. throw error se não.
        if(usuarioRequestDTO.getEmail() != null && !usuarioRequestDTO.getEmail().equals(usuario.getEmail()))
            usuario.setEmail(usuarioRequestDTO.getEmail());

        Usuario usuarioAtualizado = usuarioRepository.save(usuario);
        return convertToResponseDTO(usuarioAtualizado);
    }

    @Transactional
    public String updatePassword(Long id, String senha, String confirmacaoSenha){
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));

        // todo? aplicar validações de senha.

        if(senha.equals(confirmacaoSenha)){
            String hashedSenha = passwordEncoder.encode(senha);
            usuario.setSenha(hashedSenha);
        }

        usuarioRepository.save(usuario);

        return "Senha atualizada com sucesso";
    }

    @Transactional
    public String delete(Long id){
        
        if(!usuarioRepository.existsById(id)){
            throw new UserNotFoundException("Usuário não encontrado");
        }

        usuarioRepository.deleteById(id);

        return "Usuário deletado com sucesso";
    }

    public UsuarioResponseDTO convertToResponseDTO(Usuario usuario){
        UsuarioResponseDTO dto = new UsuarioResponseDTO();

        dto.setId(usuario.getId());
        dto.setEmail(usuario.getEmail());
        dto.setNome(usuario.getNome());

        return dto;
    }
}
