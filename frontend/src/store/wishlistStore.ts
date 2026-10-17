import { create } from "zustand";
import { IProduct } from "@/types/product";
import { api } from "@/services/api";

interface WishlistState {
  items: IProduct[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (product: IProduct) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get("/wishlist");
      set({ items: res.data.data || [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  toggleWishlist: async (product: IProduct) => {
    const isPresent = get().isInWishlist(product._id);
    // Optimistic update
    if (isPresent) {
      set({ items: get().items.filter((p) => p._id !== product._id) });
    } else {
      set({ items: [...get().items, product] });
    }

    try {
      const res = await api.post(`/wishlist/toggle/${product._id}`);
      return res.data.data.isAdded;
    } catch (err) {
      // Revert if API failed
      if (isPresent) {
        set({ items: [...get().items, product] });
      } else {
        set({ items: get().items.filter((p) => p._id !== product._id) });
      }
      throw err;
    }
  },

  isInWishlist: (productId: string) => {
    return get().items.some((p) => p._id === productId);
  },
}));

