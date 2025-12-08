package br.com.cefet.achadosperdidos.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.dto.match.MatchResponseDTO;
import br.com.cefet.achadosperdidos.services.MatchService;
import br.com.cefet.achadosperdidos.dto.res.ApiResponse;

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

    @GetMapping("/active")
    public ResponseEntity<List<MatchResponseDTO>> getActiveMatches(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = ((Usuario)auth.getPrincipal()).getId();
        List<MatchResponseDTO> matches = matchService.getAllActiveUserMaches(userId);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/archived")
    public ResponseEntity<List<MatchResponseDTO>> getArchivedMatches(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = ((Usuario)auth.getPrincipal()).getId();
        List<MatchResponseDTO> matches = matchService.getAllArchivedUserMaches(userId);
        return ResponseEntity.ok(matches);
    }

    // ARQUIVAR MATCH
    @PostMapping("/{matchId}/archive")
    public ResponseEntity<ApiResponse<String>> archiveMatch(@PathVariable Long matchId){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = ((Usuario)auth.getPrincipal()).getId();

        matchService.archiveMatch(matchId, userId);
        return ResponseEntity.ok(new ApiResponse<>("Match arquivado!", null, null));

    }

    // CONFIRMAÇÃO DE USUÁRIO
    @PatchMapping("/{matchId}/confirm")
    public ResponseEntity<ApiResponse<MatchResponseDTO>> confirmMatch(@PathVariable Long matchId){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario) auth.getPrincipal();

        MatchResponseDTO matchAtualizado = matchService.confirmMatch(matchId, usuario.getId());

        ApiResponse<MatchResponseDTO> response = new ApiResponse<>(
            "Confirmação realizada com sucesso.",
            matchAtualizado
        );

        return ResponseEntity.ok(response);

    }

    // ATIVAR MATCH (DESARQUIVAR)
    @PostMapping("/{matchId}/activate")
    public ResponseEntity<ApiResponse<String>> activateMatch(@PathVariable Long matchId){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = ((Usuario)auth.getPrincipal()).getId();

        matchService.activateMatch(matchId, userId);
        return ResponseEntity.ok(new ApiResponse<>("Match Restaurado!", null, null));

    }

    @DeleteMapping("/{matchId}")
    public ResponseEntity<ApiResponse<String>> deleteMatch(@PathVariable Long matchId){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = ((Usuario)auth.getPrincipal()).getId();
        String message = matchService.deleteMatch(matchId, userId);

        ApiResponse<String> response = new ApiResponse(message, null, null);
        
        return ResponseEntity.ok(response);
    }


}
