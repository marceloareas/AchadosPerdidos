import SockJS from "sockjs-client/dist/sockjs.js";
import Stomp from "stompjs";
import useAuthStore from "../../store/auth";
import useChatStore from "../../store/chat";
import { API_HEADER } from "./API_HEADER";

let stompClient = null;
let isConnecting = false;

const BACKEND_URL = "http://localhost:8080/ws";

// ---------------------------------------------------
// FUNÇÃO PARA CONECTAR
// ---------------------------------------------------
export const connectWebSocket = () => {
  const token = useAuthStore.getState().token;
  if (!token) {
    console.warn("⚠ Nenhum token disponível. Aguardando login...");
    return;
  }

  if (isConnecting) return;
  isConnecting = true;

  const socket = new SockJS(BACKEND_URL);
  stompClient = Stomp.over(socket);

  // Conecta usando o cabeçalho com token
  stompClient.connect(
    API_HEADER(token),
    (frame) => {
      console.log("✅ Conectado ao WebSocket:", frame);
      isConnecting = false;

      // Se inscreve no tópico privado do usuário
      stompClient.subscribe("/user/queue/messages", (msg) => {
        const data = JSON.parse(msg.body);

        // Adiciona mensagem no store
        useChatStore.getState().addMensagem(data);
      });
    },
    (error) => {
      console.error("❌ Erro de conexão WebSocket:", error);
      isConnecting = false;

      // Reconexão automática em 5s
      setTimeout(() => {
        console.log("Tentando reconectar...");
        connectWebSocket();
      }, 5000);
    }
  );
};

// ---------------------------------------------------
// FUNÇÃO PARA ENVIAR MENSAGEM
// ---------------------------------------------------
export const sendMessage = (matchId, remetenteId, conteudo) => {
  if (!stompClient || !stompClient.connected) {
    console.error("WebSocket não conectado!");
    return;
  }

  const message = { matchId, remetenteId, conteudo };
  stompClient.send("/app/chat.send", {}, JSON.stringify(message));
};

// ---------------------------------------------------
// FUNÇÃO PARA DESCONECTAR (ex: logout)
// ---------------------------------------------------
export const disconnectWebSocket = () => {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect(() => {
      console.log("🔌 WebSocket desconectado");
      stompClient = null;
    });
  }
};
