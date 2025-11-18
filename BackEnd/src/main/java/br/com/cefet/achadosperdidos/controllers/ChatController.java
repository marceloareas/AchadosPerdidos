package br.com.cefet.achadosperdidos.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.cefet.achadosperdidos.dto.chat.ChatResponseDTO;
import br.com.cefet.achadosperdidos.dto.chat.CreateChatResponseDTO;
import br.com.cefet.achadosperdidos.dto.res.ApiResponse;
import br.com.cefet.achadosperdidos.services.ChatService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;
    
    @PostMapping("/{match_id}")
    public ResponseEntity<ApiResponse<CreateChatResponseDTO>> createChat(@PathVariable("match_id") Long match_id){
        ApiResponse<CreateChatResponseDTO> response = chatService.createChat(match_id);
        return ResponseEntity.ok(response);
    }
}
