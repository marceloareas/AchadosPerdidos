package br.com.cefet.achadosperdidos.controllers;

import br.com.cefet.achadosperdidos.dto.chat.MeusChatsResponseDTO;
import br.com.cefet.achadosperdidos.dto.chat.ChatComMensagensDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.dto.mensagem.BaseMensagemDTO;
import br.com.cefet.achadosperdidos.dto.res.ApiResponse;
import br.com.cefet.achadosperdidos.services.ChatService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/{match_id}")
    public ResponseEntity<ApiResponse<ChatComMensagensDTO>> getChat(@PathVariable("match_id") Long match_id){
        //todo: retornar uma lista de mensagens junto do chat.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario)auth.getPrincipal();
        ApiResponse<ChatComMensagensDTO> response = chatService.getChat(match_id, usuario);
        return ResponseEntity.ok(response);
    }

    //todo: pegar todos os chats ( com a ultima mensagem enviada ).
   @GetMapping
   public ResponseEntity<ApiResponse<MeusChatsResponseDTO>> getChats(){
       Authentication auth = SecurityContextHolder.getContext().getAuthentication();
       Usuario usuario = (Usuario)auth.getPrincipal();
       Long userId = usuario.getId();
       ApiResponse<MeusChatsResponseDTO> response = chatService.getChats(userId);
       return ResponseEntity.ok(response);
   }

    @PostMapping("/mensagem/{chat_id}")
    public ResponseEntity<ApiResponse<String>> enviarMensagem(@PathVariable("chat_id") Long chat_id, @RequestBody BaseMensagemDTO mensagem) {
        ApiResponse<String> response = chatService.enviarMensagem(chat_id, mensagem);
        return ResponseEntity.ok(response);
    }


    
}
