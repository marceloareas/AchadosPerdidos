package br.com.cefet.achadosperdidos.dto.res;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private String menssagem;
    private T res;
}