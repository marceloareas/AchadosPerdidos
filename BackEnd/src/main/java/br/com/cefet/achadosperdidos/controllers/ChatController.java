package br.com.cefet.achadosperdidos.controllers;

import br.com.cefet.achadosperdidos.dto.chat.MeusChatsResponseDTO;
import br.com.cefet.achadosperdidos.dto.chat.ChatComMensagensDTO;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario)auth.getPrincipal();
        ApiResponse<ChatComMensagensDTO> response = chatService.getChat(match_id, usuario);
        return ResponseEntity.ok(response);
    }

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


    @PostMapping(value = "/mensagem/{chat_id}/imagem", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> enviarImagem(
            @PathVariable("chat_id") Long chatId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("remetenteId") Long remetenteId,
            @RequestParam("destinatarioId") Long destinatarioId
    ) throws IOException {
        
        // Montamos o DTO manualmente ou passamos os parâmetros
        ApiResponse<String> response = chatService.enviarMensagemImagem(chatId, file, remetenteId, destinatarioId);
        return ResponseEntity.ok(response);
    }
    
}
