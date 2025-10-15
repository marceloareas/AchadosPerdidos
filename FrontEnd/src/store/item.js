import { create } from "zustand";
import Api from "../api/Api";
import useAuthStore from "./auth";
// import { persist } from "zustand/middleware";
import { API_HEADER } from "../utils/config/API_HEADER";

const useItemStore = create((set, get) => ({
  items: [],
  itemsUser: [],
  itemsReturned: [],
  item: null,
  loading: false,
  erro: null,

  getItemsRecentlyReturned: async () => {
    set({ loading: true, erro: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.get(
        "/item/recently-returned",
        API_HEADER(token)
      );
      set({ itemsReturned: response.data, loading: false });
    } catch (err) {
      set({ erro: err.response.data, loading: false });
    } finally {
      set({ loading: false });
    }
  },

  getUserItens: async () => {
    set({ loading: true, erro: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.get("/item", API_HEADER(token));
      set({
        itemsUser: [...get().itemsUser, response.data],
        loading: false,
        erro: null,
      });
    } catch (err) {
      set({ response: err.response.data, loading: false, erro: true });
    } finally {
      set({ loading: false, erro: false });
    }
  },
  createItem: async (formData) => {
    set({ loading: true, erro: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.post("/item", formData, API_HEADER(token));
      set({
        items: [...get().items, response.data],
        loading: false,
        erro: null,
      });
    } catch (err) {
      set({ response: err.response.data, loading: false, erro: true });
    } finally {
      set({ loading: false, erro: false });
    }
  },
}));

export default useItemStore;
