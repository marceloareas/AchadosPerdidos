import { create } from "zustand";
import useAuthStore from "./auth";
import Api from "../api/Api";
import { API_HEADER } from "../utils/config/API_HEADER";

const useChatStore = create((set, get) => ({
  chats: [],
  chatAtual: {},
  loading: false,
  error: null,
  response: null,

  getChats: async () => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.get("/chat", API_HEADER(token));
      set({ chats: response.data.chats, response: response.data.message });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  getChat: async (matchId) => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.get(`/chat/${matchId}`, API_HEADER(token));
      set({ chatAtual: response.data.chat, response: response.data.message });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  // --- ADICIONAR MENSAGEM AO CHAT ATUAL (WebSocket) ---
  addMensagem: async (novaMsg, chatId) => {
    const { token } = useAuthStore.getState();
    try {
      await Api.post(
        `/chat/mensagem/${chatId}`,
        novaMsg, // BaseMensagemDTO
        API_HEADER(token)
      );
    } catch (err) {
      console.error(
        "Erro ao enviar mensagem:",
        err.response?.data || err.message
      );
    }
    set((state) => {
      if (!state.chatAtual || chatId !== state.chatAtual.id) {
        return {};
      }

      return {
        chatAtual: {
          ...state.chatAtual,
          mensagens: [...state.chatAtual.mensagens, novaMsg],
        },
      };
    });
  },
  addMensagemImagem: async (file, chatId, remetenteId, destinatarioId) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("remetenteId", remetenteId);
        formData.append("destinatarioId", destinatarioId);

        // Importante: Ao enviar FormData, o navegador define o Content-Type automaticamente
        // Não force 'application/json' aqui.
        const { token } = useAuthStore.getState();
        await Api.post(`/chat/mensagem/${chatId}/imagem`, formData, {
          headers: {
            Authorization: token
          }
        });
        
        // Não precisa adicionar manualmente na lista se o WebSocket já estiver ouvindo.
        // Se quiser otimista, converta para base64 localmente e adicione.
    } catch (error) {
        console.error("Erro ao enviar imagem", error);
    }
  },

  showMessage: async (novaMsg, chatId) => {
    console.log("quantas vezes");
    set((state) => {
      if (!state.chatAtual || chatId !== state.chatAtual.id) {
        return {};
      }

      return {
        chatAtual: {
          ...state.chatAtual,
          mensagens: [...state.chatAtual.mensagens, novaMsg],
        },
      };
    });
  },
}));

export default useChatStore;
