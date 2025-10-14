package br.com.cefet.achadosperdidos.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import br.com.cefet.achadosperdidos.domain.enums.StatusItemEnum;
import br.com.cefet.achadosperdidos.domain.enums.TipoItemEnum;
import br.com.cefet.achadosperdidos.domain.model.Categoria;
import br.com.cefet.achadosperdidos.domain.model.Usuario;
import br.com.cefet.achadosperdidos.dto.categoria.CategoriaDTO;
import br.com.cefet.achadosperdidos.dto.item.ItemRequestDTO;
import br.com.cefet.achadosperdidos.dto.item.ItemResponseDTO;
import br.com.cefet.achadosperdidos.exception.auth.NotAuthorized;
import br.com.cefet.achadosperdidos.exception.categoria.CategoriaLimitException;
import br.com.cefet.achadosperdidos.exception.categoria.CategoriaNotFound;
import br.com.cefet.achadosperdidos.exception.item.ItemNotFoundException;
import br.com.cefet.achadosperdidos.repositories.CategoriaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.cefet.achadosperdidos.domain.model.Item;
import br.com.cefet.achadosperdidos.dto.item.ItemRecentementeRetornadoResponseDTO;
import br.com.cefet.achadosperdidos.repositories.ItemRepository;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private CategoriaService categoriaService;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<ItemRecentementeRetornadoResponseDTO> getRecentItensReturned(){
        List<Item> mostRecentItens = this.itemRepository.findFirst2ByStatusOrderByDataDevolucaoDesc(StatusItemEnum.RECUPERADO);


        return mostRecentItens.stream()
                .map(this::convertToRecentlyReturnedDTO)
                .toList();
    }

    public List<ItemResponseDTO> getUserItens(Long userId){
        List<Item> itemList = this.itemRepository.findByUsuarioId(userId);
        return itemList.stream().map(this::convertToDTO).toList();
    }

    public ItemResponseDTO getItem(Long id, Usuario usuario){
        Optional<Item> item = itemRepository.findById(id);



        if(item.isEmpty()) throw new ItemNotFoundException("Item não encontrado");

        if(!item.get().getUsuario().getId().equals(usuario.getId())) throw new NotAuthorized("O item não pertence ao usuário.");

        return convertToDTO(item.get());
    }

    @Transactional
    public ItemResponseDTO createItem(ItemRequestDTO itemRequestDTO, Usuario usuario){

        Item item = new Item();
        item.setNome(itemRequestDTO.getNome());
        item.setTipo(itemRequestDTO.getTipo());
        item.setDescricao(itemRequestDTO.getDescricao());
        item.setDataEvento(itemRequestDTO.getDataEvento());
        item.setLocalizacao(itemRequestDTO.getLocalizacao());

        item.setUsuario(usuario);

        itemRequestDTO.getCategorias().forEach(categoriaDTO -> {
            Categoria categoria = categoriaRepository.findById(categoriaDTO.getId()).orElseThrow(() -> new CategoriaNotFound("Erro ao carregar categoria(s)."));
            item.addCategoria(categoria);
        });

        if(item.getTipo() == TipoItemEnum.ACHADO && item.getCategorias().size() != 1){
            throw new CategoriaLimitException("Itens achados só podem possuir uma categoria.");
        }

        if(item.getCategorias().isEmpty()){
            throw new CategoriaLimitException("Itens devem possuir pelo menos uma categoria");
        }

        item.setDataCriacao(LocalDateTime.now());
        item.setDataDevolucao(null);
        item.setStatus(StatusItemEnum.MATCHING);
        Item createdItem = itemRepository.save(item);

        //disparar Thread de match

        return this.convertToDTO(createdItem);
    }


    public ItemRecentementeRetornadoResponseDTO convertToRecentlyReturnedDTO(Item item){
        ItemRecentementeRetornadoResponseDTO dto = new ItemRecentementeRetornadoResponseDTO();
        dto.setId(item.getId());
        dto.setTipo(item.getTipo());
        dto.setNome(item.getNome());
        dto.setStatus(item.getStatus());
        dto.setLocalizacao(item.getLocalizacao());
        dto.setDescricao(item.getDescricao());
        Optional<Categoria> categoriaOptional = item.getCategorias().stream().findFirst();

        categoriaOptional.ifPresent(categoria -> {
            CategoriaDTO categoriaDTO = new CategoriaDTO();
            categoriaDTO.setId(categoria.getId());
            categoriaDTO.setNome(categoria.getNome());
            dto.setCategoria(categoriaDTO);
        });

        return dto;
    }

    public ItemResponseDTO convertToDTO(Item item){
        ItemResponseDTO dto = new ItemResponseDTO();
        dto.setId(item.getId());
        dto.setTipo(item.getTipo());
        dto.setNome(item.getNome());
        dto.setStatus(item.getStatus());
        dto.setLocalizacao(item.getLocalizacao());
        dto.setDescricao(item.getDescricao());
        dto.setDataEvento(item.getDataEvento());
        List<CategoriaDTO> categorias = item.getCategorias().stream().map(categoriaService::convertToResponseDTO).toList();
        dto.setCategorias(categorias);

        return dto;
    }


}
