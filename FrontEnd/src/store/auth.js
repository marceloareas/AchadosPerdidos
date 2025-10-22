import { create } from "zustand";
import useUserStore from "./user.js";
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

      const token = response.data.token;
      localStorage.setItem("Bearer-token", token);
      set(() => ({
        response: response.message,
        loading: false,
        token: token,
      }));

      const userResponse = await Api.get("/auth/me", {
        headers: { Authorization: token },
      });

      const { nome, email } = userResponse.data;

      localStorage.setItem("user", JSON.stringify({ nome, email }));
      const { setUser } = useUserStore.getState();
      setUser({ nome, email });
    } catch (err) {
      set({ response: err.response?.data, loading: false, erro: true });
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
