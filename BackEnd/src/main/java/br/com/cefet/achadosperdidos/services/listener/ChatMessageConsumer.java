package br.com.cefet.achadosperdidos.services.listener;


import br.com.cefet.achadosperdidos.config.RabbitConfig;
import br.com.cefet.achadosperdidos.domain.model.BaseMensagem;
import br.com.cefet.achadosperdidos.repositories.ChatRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class ChatMessageConsumer {

    @Autowired
    private SimpMessagingTemplate websocketTemplate; // O "carteiro" do WebSocket

    @Autowired
    private ChatRepository chatRepository; // Para descobrir quem é o destinatário

    // Escuta a fila no RabbitConfig
    @RabbitListener(queues = RabbitConfig.QUEUE_NAME)
    public void onMessageReceived(BaseMensagem mensagem) {

        System.out.println("Nova mensagem recebida do RabbitMQ: " + mensagem.getId());

        //todo: transformar a mensagem em uma mensagem especifica com o factory.

        try {
            Long destinatarioId = mensagem.getDestinatarioId();

            // O frontend do usuário deve estar inscrito em: /user/{id}/queue/messages
            if (destinatarioId != null) {
                websocketTemplate.convertAndSendToUser(
                        String.valueOf(destinatarioId),
                        "/queue/messages",
                        mensagem // O Spring serializa isso para JSON automaticamente
                );
                System.out.println("Enviado via WebSocket para o usuário: " + destinatarioId);
            }

        } catch (Exception e) {
            System.err.println("Erro ao processar mensagem do Rabbit: " + e.getMessage());
        }
    }

}