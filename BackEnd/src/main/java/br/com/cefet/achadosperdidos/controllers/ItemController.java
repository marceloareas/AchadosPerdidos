package br.com.cefet.achadosperdidos.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import br.com.cefet.achadosperdidos.dto.item.ItemRequestDTO;
import br.com.cefet.achadosperdidos.dto.item.ItemResponseDTO;
import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.dto.item.ItemRecentementeRetornadoResponseDTO;
import br.com.cefet.achadosperdidos.services.ItemService;
import br.com.cefet.achadosperdidos.dto.res.ApiResponse;

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
    // public ResponseEntity<ItemResponseDTO> createItem(@RequestBody ItemRequestDTO itemRequestDTO){
    public ResponseEntity<ApiResponse<ItemResponseDTO>> createItem(@RequestBody ItemRequestDTO itemRequestDTO){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario user = (Usuario)auth.getPrincipal();
        ItemResponseDTO item = itemService.createItem(itemRequestDTO, user);
        
        ApiResponse<ItemResponseDTO> response = new ApiResponse<ItemResponseDTO>(
            "Item cadastrado com sucesso!",
            "item",
            item
        );
            
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{itemId}")
    // public ResponseEntity<ItemResponseDTO> patchItem(@PathVariable Long itemId, @RequestBody ItemRequestDTO itemRequestDTO){
    public ResponseEntity<ApiResponse<ItemResponseDTO>> patchItem(@PathVariable Long itemId, @RequestBody ItemRequestDTO itemRequestDTO){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario)auth.getPrincipal();
        ItemResponseDTO itemAtualizado = itemService.patchItem(itemId, itemRequestDTO, usuario);

        ApiResponse<ItemResponseDTO> response = new ApiResponse<>("Item Atualizado com sucesso!","item", itemAtualizado);
        // return ResponseEntity.ok(itemAtualizado);
        return ResponseEntity.ok(response);    
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<String> deleteItem(@PathVariable Long itemId){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario)auth.getPrincipal();
        String resposta = itemService.deleteItem(itemId, usuario);
        return ResponseEntity.ok(resposta);
    }

}
