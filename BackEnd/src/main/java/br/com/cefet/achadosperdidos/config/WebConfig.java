package br.com.cefet.achadosperdidos.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Toda URL que bater em /imagens/chat/ vai buscar na pasta uploads/chat/
        registry.addResourceHandler("/imagens/chat/**")
                .addResourceLocations("file:uploads/chat/");
    }
}