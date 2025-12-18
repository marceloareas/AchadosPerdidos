import SockJS from "sockjs-client/dist/sockjs.js";
import { Stomp } from "@stomp/stompjs";
import useChatStore from "../../store/chat";
import useAuthStore from "../../store/auth";

const BACKEND_URL = "http://localhost:8080/ws";

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.subscription = null; // Guarda a referência da inscrição
    this.isConnected = false;
  }

  connectWebSocket() {
    console.log("Iniciando conexão WebSocket...");

    const token = useAuthStore.getState().token;

    const socket = new SockJS(BACKEND_URL);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect(
      { Authorization: token },
      (frame) => {
        this.isConnected = true;
        console.log("✅ Conectado ao WebSocket:", frame);

        // Se já existisse uma inscrição anterior pendente, removemos.
        if (this.subscription) {
            console.log("Ja tinha subscription, tirando subscribe.");
            this.subscription.unsubscribe();
        }

        this.subscription = this.stompClient.subscribe("/user/queue/messages", (msg) => {
          console.log("realizando inscricao");
          this.handleMessage(msg);
        });
      },
      (error) => {
        console.error("❌ Erro WebSocket:", error);
        this.isConnected = false;
        this.cleanup(); // Garante limpeza em caso de erro
      }
    );
  }

  handleMessage(msg) {
    try {
      const data = JSON.parse(msg.body);
      console.log("📩 Mensagem recebida:", data);
      
      const { id, chatId, ...mensagemSemId } = data;
      // Atualiza a store
      useChatStore.getState().showMessage(mensagemSemId, data.chatId);
    } catch (e) {
      console.error("Erro ao processar mensagem", e);
    }
  } 

  disconnect() {
    if (this.stompClient) {
      console.log("🔌 Desconectando WebSocket...");
      
      // Se houver uma inscrição ativa, cancela
      if (this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
      }

      this.stompClient.disconnect(() => {
        console.log("✅ WebSocket desconectado com sucesso.");
      });
    }
    this.cleanup(); //reseta as variáveis
  }

  cleanup() {
    this.stompClient = null;
    this.subscription = null;
    this.isConnected = false;
  }
}

const webSocketService = new WebSocketService(); //instacia uma vez no ciclo de vida de iniciação do react
export default webSocketService;