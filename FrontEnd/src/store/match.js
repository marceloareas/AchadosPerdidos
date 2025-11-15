import { create } from "zustand";
import Api from "../api/Api";
import useAuthStore from "./auth";
import { API_HEADER } from "../utils/config/API_HEADER";

const useMatchStore = create((set, get) => ({
  matches: [],
  loading: false,
  error: null,
  response: null,

  getMatches: async () => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.get("/match", API_HEADER(token));
      // console.log(response.data);
      set({ matches: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  deleteMatch: async (idMatch) => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.delete(`/match/${idMatch}`, API_HEADER(token));
      console.log(response);
      await get().getMatches();
      set({ loading: false, erro: null, response: response.data.message });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
export default useMatchStore;
