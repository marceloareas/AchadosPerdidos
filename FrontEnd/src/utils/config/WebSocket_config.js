import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client'; // Importação limpa e segura para o Vite

export const createWebSocketClient = (token) => {
    // Garante que não teremos "Bearer Bearer" na hora de enviar
    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    return new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        connectHeaders: {
            Authorization: authHeader
        },
        // O Megafone do STOMP! Agora ele é obrigado a falar no console.
        debug: (str) => {
            console.log('📡 STOMP DEBUG: ', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });
};