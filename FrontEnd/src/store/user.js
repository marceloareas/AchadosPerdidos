import { create } from "zustand";
import Api from "../api/Api";

// /users

const useUserStore = create((set, get) => ({
  user: null,
  users: [],
  setUser: (userData) => set({ user: userData }),
  loading: false,
  error: null,

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

  // atualizar usuario
  updateUser: async (userId, userData) => {
    set({ loading: true, error: null });
    try {
      const response = await Api.put(`/users/${userId}`, userData);
      const updatedUser = response.data;

      // if (updatedUser.token) {
      //     localStorage.setItem("token", updatedUser.token);
      // }

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: updatedUser.id,
          nome: updatedUser.nome,
          email: updatedUser.email,
        })
      );

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

  // deletar usuario
  deleteUser: async (userId) => {
    set({ loading: true });
    try {
      await Api.delete(`/user/${userId}`);
      set((state) => ({
        users: state.users.filter((u) => u.userId !== userId),
        user: {},
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useUserStore;
