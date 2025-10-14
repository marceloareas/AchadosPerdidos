import { create } from "zustand";
import Api from "../api/Api";
import useAuthStore from "./auth";
// import { persist } from "zustand/middleware";
import { API_HEADER } from "../utils/config/API_HEADER";

const useItemStore = create((set, get) => ({
  items: [],
  itemsReturned: [],
  item: null,
  loading: false,
  error: null,

  getItemsRecentlyReturned: async () => {
    set({ loading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const response = await Api.get(
        "/item/recently-returned",
        API_HEADER(token)
      );
      set({ itemsReturned: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useItemStore;
