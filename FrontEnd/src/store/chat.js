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
    const { chatAtual } = get();
    const { token } = useAuthStore.getState();
    try {
      const response = await Api.post(
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
    if (!chatAtual || novaMsg.matchId !== chatAtual.match_id) return;

    set({
      chatAtual: {
        ...chatAtual,
        mensagens: [...(chatAtual.mensagens || []), novaMsg],
      },
    });
  },
}));

export default useChatStore;
