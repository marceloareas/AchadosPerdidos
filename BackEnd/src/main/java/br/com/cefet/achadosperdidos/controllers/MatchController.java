package br.com.cefet.achadosperdidos.controllers;

import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.dto.match.MatchResponseDTO;
import br.com.cefet.achadosperdidos.services.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/match")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @GetMapping
    public ResponseEntity<List<MatchResponseDTO>> getMatches(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = ((Usuario)auth.getPrincipal()).getId();
        List<MatchResponseDTO> match_list = matchService.getAllUserMatches(userId);
        return ResponseEntity.ok(match_list);
    }
}
