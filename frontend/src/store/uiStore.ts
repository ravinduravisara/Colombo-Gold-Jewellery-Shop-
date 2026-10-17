import { create } from "zustand";
import { IProduct } from "@/types/product";

interface UIState {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  quickViewProduct: IProduct | null;
  setQuickViewProduct: (product: IProduct | null) => void;
  toastMessage: { type: "success" | "error" | "info" | "warning"; text: string } | null;
  showToast: (text: string, type?: "success" | "error" | "info" | "warning") => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  quickViewProduct: null,
  setQuickViewProduct: (product) => set({ quickViewProduct: product }),
  toastMessage: null,
  showToast: (text, type = "success") => {
    set({ toastMessage: { type, text } });
    setTimeout(() => {
      set({ toastMessage: null });
    }, 4000);
  },
}));
