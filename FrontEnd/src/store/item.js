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
  response: null,

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
    }
  },

  getUserItens: async () => {
    set({ loading: true, erro: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.get("/item", API_HEADER(token));
      set({
        itemsUser: response.data,
        loading: false,
        erro: null,
      });
    } catch (err) {
      set({ response: err.response.data, loading: false, erro: true });
    }
  },
  createItem: async (formData) => {
    set({ loading: true, erro: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.post("/item", formData, API_HEADER(token));
      set({
        items: [...get().items, response.data.item],
        response: response.data.message,
        loading: false,
        erro: null,
      });
    } catch (err) {
      set({ response: err.response.data, loading: false, erro: true });
    }
  },

  updateItem: async (id, formData) => {
    set({ loading: true, erro: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.patch(
        `/item/${id}`,
        formData,
        API_HEADER(token)
      );

      const updatedItemsUser = get().itemsUser.map((item) =>
        item.id === id ? response.data.item : item
      );
      console.log("Payload enviado:", formData);
      console.log("Item atualizado com sucesso:", response.data);
      set({
        itemsUser: updatedItemsUser,
        response: response.data.message,
        loading: false,
        erro: null,
        item: response.data.item,
      });
      get().getUserItens();
    } catch (err) {
      console.error(err);
      set({
        loading: false,
        erro: err.response?.data || "Erro ao atualizar item",
      });
    }
  },

  deleteItem: async (id) => {
    set({ loading: true, erro: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.delete(`/item/${id}`, API_HEADER(token));
      await get().getUserItens();
      set({ loading: false, erro: null, response: response.data });
    } catch (err) {
      set({ response: err.response.data, loading: false, erro: true });
    }
  },
}));

export default useItemStore;
