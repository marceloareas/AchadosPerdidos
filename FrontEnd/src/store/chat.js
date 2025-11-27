import { create } from "zustand";
import useAuthStore from "./auth";
import Api from "../api/Api";
import { API_HEADER } from "../utils/config/API_HEADER";


const useChatStore = create((set, get) => ({
    chats: [],
    chatAtual: {},
    loading: false,
    error: null,
    resposne: null,


    getChats: async () => {
        set({ loading: true, error: null });
        try{
            const { token } = useAuthStore.getState();
            const response = await Api.get("/chat", API_HEADER(token));
            set({ chats: response.chats });
        } catch(error) {
            set({ error: error.message });
        } finally {
            set({loading: false });
        }
    },
    getChat: async (matchId) => {
        set({ loading: true, error: null });
        try{
            const { token } = useAuthStore.getState();
            const response = await Api.get(`/chat/${matchId}`, API_HEADER(token));
            set({ chatAtual: response.chat });
        } catch(error) {
            set({ error: error.message });
        } finally {
            set({ loading : false });
        }
    },



}))


export default useChatStore;