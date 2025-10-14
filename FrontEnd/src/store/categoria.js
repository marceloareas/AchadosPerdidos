import { create } from "zustand";
import Api from "../api/Api";
import useAuthStore from "./auth";
import { API_HEADER } from "../utils/config/API_HEADER";

const useCategoriaStore = create((set, get) => ({
  categorias: [],
  categoria: null,
  loading: false,
  error: null,

  getCategorias: async () => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.get("/category", API_HEADER(token));
      console.log(response.data);
      set({ categorias: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    } finally {
      set({ loading: false, error: null, response: null });
    }
  },
}));
export default useCategoriaStore;
