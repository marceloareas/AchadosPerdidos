import { create } from "zustand";
import Api from "../api/Api";
import useAuthStore from "./auth";
import { API_HEADER } from "../utils/config/API_HEADER";

const useMatchStore = create((set, get) => ({
  matchesAtivos: [],
  matchesArquivados: [],
  matchesFinalizados: [],
  loading: false,
  error: null,
  response: null,

  // getMatches: async () => {
  //   set({ loading: true, error: null });
  //   try {
  //     const { token } = useAuthStore.getState();
  //     const response = await Api.get("/match", API_HEADER(token));
  //     // console.log(response.data);
  //     set({ matches: response.data, loading: false });
  //   } catch (error) {
  //     set({ error: error.message, loading: false });
  //   }
  // },

  getMatchesAtivos: async () => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.get("/match/active", API_HEADER(token));
      set({ matchesAtivos: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  getMatchesArquivados: async () => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.get("/match/archived", API_HEADER(token));
      set({ matchesArquivados: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  getMatchesFinalizados: async () => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.get("/match/finished", API_HEADER(token));
      set({ matchesFinalizados: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  matchActivate: async (idMatch) => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.post(
        `/match/${idMatch}/activate`,
        {},
        API_HEADER(token)
      );
      await get().getMatchesAtivos();
      await get().getMatchesArquivados();
      set({ loading: false, error: null, response: response.data.message });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  matchArchive: async (idMatch) => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.post(
        `/match/${idMatch}/archive`,
        {},
        API_HEADER(token)
      );
      await get().getMatchesAtivos();
      await get().getMatchesArquivados();
      set({ loading: false, error: null, response: response.data.message });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  confirmMatch: async (idMatch) => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.patch(
        `/match/${idMatch}/confirm`,
        {},
        API_HEADER(token)
      );
      set({ loading: false, error: null, response: response.data.message });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteMatch: async (idMatch) => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.delete(`/match/${idMatch}`, API_HEADER(token));
      await get().getMatchesAtivos();
      await get().getMatchesArquivados();
      set({ loading: false, error: null, response: response.data.message });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
export default useMatchStore;
