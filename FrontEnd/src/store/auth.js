import { create } from "zustand";
import Api from "../api/Api";

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem("Bearer-token") || null,
  user: JSON.parse(localStorage.getItem("user")) || null,
  response: null,
  loading: false,
  erro: false, // Começa como falso

  register: async (formData) => {
    set({ loading: true, erro: false }); // Reseta o erro a cada tentativa
    try {
      const response = await Api.post("/auth/register", formData);
      set({
        response: response.data.message,
        loading: false,
        erro: false
      });
    } catch (err) {
      console.log(err);
      set({
        response: err.response?.data || "Erro ao registrar",
        loading: false,
        erro: true,
      });
    }
  },

  login: async (formData) => {
    set({ loading: true, erro: false }); // Limpa qualquer erro antigo!
    try {
      const response = await Api.post("/auth/login", formData);

      const token = response.data.token;
      // Salva o token no localStorage imediatamente
      localStorage.setItem("Bearer-token", token);
      
      // Como o token já está no localStorage, o interceptador do Api.js já o anexa automaticamente aqui:
      const userResponse = await Api.get("/auth/me");

      const { nome, email } = userResponse.data;

      localStorage.setItem("user", JSON.stringify({ nome, email }));
      
      // Define tudo de uma vez como SUCESSO
      set({ 
        response: response.data.message || "Login realizado com sucesso", 
        loading: false, 
        token: token,
        user: userResponse.data,
        erro: false // Garante que a flag de erro seja falsa
      });
    } catch (err) {
      set({ 
        response: err.response?.data || "Erro ao fazer login. Verifique as credenciais.", 
        loading: false, 
        erro: true 
      });
    }
  },

  logout: () => {
    localStorage.removeItem("Bearer-token");
    localStorage.removeItem("user");
    set({ token: null, user: null, erro: false, response: null });
  },
}));

export default useAuthStore;