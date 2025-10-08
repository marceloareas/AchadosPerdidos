import { create } from "zustand";
import Api from "../api/Api";

const useCategoriaStore = create((set, get) => ({
  categorias: [],
  categoria: null,
  loading: false,
  error: null,

  getCategorias: async () => {
    set({ loading: true, error: null });
    try {
      const response = await Api.get("/category");
      console.log(response.data);
      set({ categorias: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    } finally {
      set({ loading: false });
    }
  },
}));
export default useCategoriaStore;
