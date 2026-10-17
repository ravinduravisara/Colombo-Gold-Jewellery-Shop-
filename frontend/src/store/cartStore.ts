import { create } from "zustand";
import { ICartItem } from "@/types/product";
import { cartService } from "@/services/cartService";

interface CartState {
  items: ICartItem[];
  subtotal: number;
  isLoading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number, variantId?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,
  isLoading: false,
  isOpen: false,

  setIsOpen: (open) => set({ isOpen: open }),

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const cart = await cartService.getCart();
      set({ items: cart.items || [], subtotal: cart.subtotal || 0, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, quantity = 1, variantId) => {
    try {
      set({ isLoading: true });
      const cart = await cartService.addItem(productId, quantity, variantId);
      set({ items: cart.items || [], subtotal: cart.subtotal || 0, isLoading: false, isOpen: true });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      set({ isLoading: true });
      const cart = await cartService.updateQuantity(itemId, quantity);
      set({ items: cart.items || [], subtotal: cart.subtotal || 0, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  removeItem: async (itemId) => {
    try {
      set({ isLoading: true });
      const cart = await cartService.removeItem(itemId);
      set({ items: cart.items || [], subtotal: cart.subtotal || 0, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  clearCart: async () => {
    try {
      set({ isLoading: true });
      await cartService.clearCart();
      set({ items: [], subtotal: 0, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  totalCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));

