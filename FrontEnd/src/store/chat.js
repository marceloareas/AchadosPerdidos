import { create } from "zustand";
import Api from "../api/Api";

const useChatStore = create((set, get) => ({
  chats: [],
  chatAtual: {},
  loading: false,
  error: null,
  response: null,

  getChats: async () => {
    set({ loading: true, error: null });
    try {
      // O Api.js intercepta e coloca o token sozinho!
      const response = await Api.get("/chat");
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
      // O Api.js intercepta e coloca o token sozinho!
      const response = await Api.get(`/chat/${matchId}`);
      set({ chatAtual: response.data.chat, response: response.data.message });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  // --- ADICIONAR MENSAGEM AO CHAT ATUAL ---
  addMensagem: async (novaMsg, chatId) => {
    try {

      await Api.post(`/chat/mensagem/${chatId}`, novaMsg);
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

  showMessage: async (novaMsg, chatId) => {
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