import { create } from "zustand";
import Api from "../api/Api";

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem("token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  response: null,
  loading: false,
  error: null,

  register: async (formData) => {
    set({ loading: true, erro: null });
    try {
      const response = await Api.post("/auth/register", formData);
      set((state) => ({
        response: response.message,
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAuthStore;
