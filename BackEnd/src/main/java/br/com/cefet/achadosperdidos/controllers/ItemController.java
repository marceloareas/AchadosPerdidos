package br.com.cefet.achadosperdidos.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import br.com.cefet.achadosperdidos.dto.item.ItemRequestDTO;
import br.com.cefet.achadosperdidos.dto.item.ItemResponseDTO;
import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.dto.item.ItemRecentementeRetornadoResponseDTO;
import br.com.cefet.achadosperdidos.services.ItemService;

@RestController
@RequestMapping(value = "/item")

public class ItemController {
    
    private final ItemService itemService;
    
    public ItemController(ItemService itemService){
        this.itemService = itemService;
    }

    @GetMapping("recently-returned")
    public ResponseEntity<List<ItemRecentementeRetornadoResponseDTO>> getTwoRecentReturnedItens() {
        List<ItemRecentementeRetornadoResponseDTO> recentItemList = itemService.getRecentItensReturned();
        return ResponseEntity.ok(recentItemList);
    }

    @GetMapping
    public ResponseEntity<List<ItemResponseDTO>> getUserItens(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = ((Usuario)auth.getPrincipal()).getId();
        List<ItemResponseDTO> itens = itemService.getUserItens(userId);
        return ResponseEntity.ok(itens);
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<ItemResponseDTO> getItem(@PathVariable Long itemId){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario)auth.getPrincipal();
        ItemResponseDTO item = itemService.getItem(itemId, usuario);
        return ResponseEntity.ok(item);
    }

    @PostMapping
    public ResponseEntity<ItemResponseDTO> createItem(@RequestBody ItemRequestDTO itemRequestDTO){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario user = (Usuario)auth.getPrincipal();
        ItemResponseDTO item = itemService.createItem(itemRequestDTO, user);
        return ResponseEntity.ok(item);
    }

    @PatchMapping("/{itemId}")
    public ResponseEntity<ItemResponseDTO> patchItem(@PathVariable Long itemId, @RequestBody ItemRequestDTO itemRequestDTO){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario)auth.getPrincipal();
        ItemResponseDTO itemAtualizado = itemService.patchItem(itemId, itemRequestDTO, usuario);
        return ResponseEntity.ok(itemAtualizado);
    }
}
