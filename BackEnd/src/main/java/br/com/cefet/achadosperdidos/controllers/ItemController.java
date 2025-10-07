package br.com.cefet.achadosperdidos.controllers;

import br.com.cefet.achadosperdidos.dto.item.ItemResponseDTO;
import br.com.cefet.achadosperdidos.services.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/item")
public class ItemController {
    
    private final ItemService itemService;
    
    public ItemController(ItemService itemService){
        this.itemService = itemService;
    }

    @GetMapping("recently-returned")
    public ResponseEntity<List<ItemResponseDTO>> getTwoRecentReturnedItens(){
        List<ItemResponseDTO> recentItemList = itemService.getRecentItensReturned(); 
        return ResponseEntity.ok(recentItemList);
    }

}
