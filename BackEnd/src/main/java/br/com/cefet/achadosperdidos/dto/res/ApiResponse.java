package br.com.cefet.achadosperdidos.dto.res;


import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import java.util.HashMap;
import java.util.Map;

public class ApiResponse<T> {
    private String message;

    @JsonUnwrapped
    private T data;
    
    private Map<String, Object> content = new HashMap<>();

    public ApiResponse(String message, String key, T value) {
        this.message = message;
        
        if(value != null && key != null){
            this.content.put(key, value);
        }
    }

    public ApiResponse(String message, T data){
        this.message = message;
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public T getData(){
        return data;
    }

    @JsonAnyGetter
    public Map<String, Object> getContent() {
        return content;
    }
}
