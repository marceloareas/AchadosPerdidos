import { create } from "zustand";
import useUserStore from "./user.js";
import Api from "../api/Api";

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem("Bearer-token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  response: null,
  response: null,
  loading: false,
  erro: null,

  register: async (formData) => {
    set({ loading: true, erro: null });
    try {
      const response = await Api.post("/auth/register", formData);
      set((state) => ({
        response: response.data.message,
        loading: false,
      }));
    } catch (err) {
      console.log(err);
      set({
        response: err.response.data,
        loading: false,
        erro: true,
      });
    }
  },

  login: async (formData) => {
    set({ loading: true, erro: null });
    try {
      const response = await Api.post("/auth/login", formData);

      const token = response.data.token;
      localStorage.setItem("Bearer-token", token);
      set(() => ({
        response: response.data.message,
        loading: false,
        token: token,
      }));

      const userResponse = await Api.get("/auth/me", {
        headers: { Authorization: token },
      });

      const { nome, email } = userResponse.data;

      localStorage.setItem("user", JSON.stringify({ nome, email }));
      set({ user: userResponse.data });
    } catch (err) {
      set({ response: err.response?.data, loading: false, erro: true });
    }
  },

  logout: () => {
    localStorage.removeItem("Bearer-token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
