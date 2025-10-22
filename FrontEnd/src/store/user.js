import { create } from "zustand";
import Api from "../api/Api";
import { API_HEADER } from "../utils/config/API_HEADER";
import useAuthStore from "./auth";

// /users
const useUserStore = create((set, get) => ({
  user: null,
  users: [],
  setUser: (userData) => set({ user: userData }),
  loading: false,
  error: null,
  response: null,

  // obter user pelo id
  fetchUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await Api.get(`/users/${id}`);
      set({ user: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    } finally {
      set({ loading: false });
    }
  },

  // deletar usuario
  deleteUser: async () => {
    set({ loading: true });
    try {
      const { token } = useAuthStore.getState();
      await Api.delete(`/users`, API_HEADER(token));
      useAuthStore.setState({ token: null, user: null });
      localStorage.removeItem("Bearer-token");
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ loading: false });
    }
  },
  // atualizar usuario
  updateUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.patch(`/users`, userData, API_HEADER(token));
      if (!response) {
        set({ response: "Erro ao atualizar o usuário" });
      }
      console.log(response);
      const updatedUser = response.data;
      set((state) => ({
        users: state.users.map((u) => (u.id === userId ? updatedUser : u)),
        user: updatedUser,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
      });
    } finally {
      set({ loading: false });
    }
  },

  updatePassword: async (passData) => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.post(
        `/auth/updatePassword`,
        passData,
        API_HEADER(token)
      );
      set({ response: response.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
      });
    }
  },
}));

export default useUserStore;
