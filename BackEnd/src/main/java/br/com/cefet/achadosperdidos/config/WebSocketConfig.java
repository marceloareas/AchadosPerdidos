package br.com.cefet.achadosperdidos.config;

import br.com.cefet.achadosperdidos.config.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.List;

@Configuration
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE + 99) // Prioridade alta para rodar antes da segurança padrão
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private TokenService tokenService;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    // Interceptador de Conexão
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {

                // 1. Acessa os cabeçalhos da mensagem STOMP
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                // 2. Verifica se é um comando de 'CONNECT' (Tentativa de conexão)
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {

                    // 3. Busca o header 'Authorization' que o Frontend enviou
                    String authorizationHeader = accessor.getFirstNativeHeader("Authorization");

                    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {

                        // 4. Remove o prefixo "Bearer " para pegar só o hash
                        String token = authorizationHeader.substring(7);

                        // 5. Usa o SEU TokenService para validar
                        // Se for válido, retorna o ID (Long). Se não, retorna null.
                        Long usuarioId = tokenService.validateToken(token);

                        if (usuarioId != null) {
                            // 6. Cria a autenticação do Spring Security
                            // Importante: Transformamos o ID em String para ser o "Principal"
                            UsernamePasswordAuthenticationToken auth =
                                    new UsernamePasswordAuthenticationToken(String.valueOf(usuarioId), null, List.of());

                            // 7. INJETA O USUÁRIO NA SESSÃO WEBSOCKET
                            accessor.setUser(auth);
                        }
                    }
                }
                return message;
            }
        });
    }
}