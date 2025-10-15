import { create } from "zustand";
import Api from "../api/Api";

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem("Bearer-token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  response: null,
  loading: false,
  erro: null,

  register: async (formData) => {
    set({ loading: true, erro: null });
    try {
      const response = await Api.post("/auth/register", formData);
      set((state) => ({
        response: response.message,
        loading: false,
      }));
    } catch (err) {
      console.log(err);
      set({ response: err.response.data, loading: false, erro: true });
    }
  },

  login: async (formData) => {
    set({ loading: true, erro: null });
    try {
      const response = await Api.post("/auth/login", formData);
      console.log(response);
      localStorage.setItem("Bearer-token", response.data.token);
      set(() => ({
        response: response.message,
        loading: false,
        token: localStorage.getItem("Bearer-token"),
      }));
    } catch (err) {
      set({ response: err.response.data, loading: false, erro: true });
      console.log(err);
      console.log(get().erro);
      console.log(get().response);
    }
  },

  logout: () => {
    localStorage.removeItem("Bearer-token");
    set({ token: null });
  },

}));

export default useAuthStore;
