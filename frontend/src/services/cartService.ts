import { api } from "./api";
import { ICartItem } from "@/types/product";
import { ApiResponse } from "@/types/api";

export const cartService = {
  async getCart() {
    const res = await api.get<ApiResponse<{ items: ICartItem[]; subtotal: number }>>("/cart");
    return res.data.data;
  },

  async addItem(productId: string, quantity = 1, variantId?: string) {
    const res = await api.post<ApiResponse<{ items: ICartItem[]; subtotal: number }>>(
      "/cart/items",
      { productId, quantity, variantId }
    );
    return res.data.data;
  },

  async updateQuantity(itemId: string, quantity: number) {
    const res = await api.patch<ApiResponse<{ items: ICartItem[]; subtotal: number }>>(
      `/cart/items/${itemId}`,
      { quantity }
    );
    return res.data.data;
  },

  async removeItem(itemId: string) {
    const res = await api.delete<ApiResponse<{ items: ICartItem[]; subtotal: number }>>(
      `/cart/items/${itemId}`
    );
    return res.data.data;
  },

  async clearCart() {
    const res = await api.delete<ApiResponse<{ items: ICartItem[]; subtotal: number }>>("/cart");
    return res.data.data;
  },

  async mergeGuestCart(guestSessionId: string) {
    const res = await api.post<ApiResponse<{ items: ICartItem[]; subtotal: number }>>(
      "/cart/merge",
      { guestSessionId }
    );
    return res.data.data;
  },
};

