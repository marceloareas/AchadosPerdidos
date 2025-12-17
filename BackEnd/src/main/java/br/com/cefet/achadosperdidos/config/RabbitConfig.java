package br.com.cefet.achadosperdidos.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String TOPIC_EXCHANGE_NAME = "chat-topic-exchange";
    public static final String QUEUE_NAME = "fila_processamento_websocket";

    @Bean
    public MessageConverter jsonMessageConverter() {
        // Isso configura o Jackson (lib padrão de JSON do Spring) para lidar com a serialização
        return new Jackson2JsonMessageConverter();
    }

    // Cria a Fila Principal do Backend
    @Bean
    public Queue mainQueue() {
        return new Queue(QUEUE_NAME, false);
    }

    // Cria o Topic Exchange
    @Bean
    public TopicExchange exchange() {
        return new TopicExchange(TOPIC_EXCHANGE_NAME);
    }

    // Cria o Binding
    @Bean
    public Binding binding(Queue mainQueue, TopicExchange exchange) {
        return BindingBuilder.bind(mainQueue).to(exchange).with("user.#");
    }
}