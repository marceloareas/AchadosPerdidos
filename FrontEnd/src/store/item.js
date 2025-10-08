import { create } from "zustand";
import Api from "../api/Api";
// import { persist } from "zustand/middleware";

const useItemStore = create((set, get) => ({
  items: [],
  itemsReturned: [],
  item: null,
  loading: false,
  error: null,

  getItemsRecentlyReturned: async () => {
    set({ loading: true, error: null });
    try {
      const response = await Api.get("/item/recently-returned");
      set({ itemsReturned: response.data, loading: false });
      // console.log(response.data);
    } catch (error) {
      set({ error: error.message, loading: false });
    } finally {
      set({ loading: false });
    }
  },
}));
//   {
//     name: "item-storage", // unique name
//   }

export default useItemStore;
