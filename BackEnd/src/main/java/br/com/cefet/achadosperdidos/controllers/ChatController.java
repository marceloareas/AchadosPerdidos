package br.com.cefet.achadosperdidos.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.dto.chat.ChatResponseDTO;
import br.com.cefet.achadosperdidos.dto.chat.CreateChatResponseDTO;
import br.com.cefet.achadosperdidos.dto.mensagem.BaseMensagemDTO;
import br.com.cefet.achadosperdidos.dto.res.ApiResponse;
import br.com.cefet.achadosperdidos.services.ChatService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;
    
    @GetMapping("/{match_id}")
    public ResponseEntity<ApiResponse<CreateChatResponseDTO>> getChat(@PathVariable("match_id") Long match_id){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario)auth.getPrincipal();
        ApiResponse<CreateChatResponseDTO> response = chatService.getChat(match_id, usuario);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{chat_id}/mensagem")
    public ApiResponse<String> postMethodName(@PathVariable("chat_id") Long chat_id, @RequestBody BaseMensagemDTO mensagem) {
        ApiResponse<String> response = chatService.enviarMensagem(chat_id, mensagem);
        return response;
    }
    
}
