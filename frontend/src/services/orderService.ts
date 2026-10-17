import { api } from "./api";
import { IOrder } from "@/types/order";
import { ApiResponse } from "@/types/api";

export const orderService = {
  async createOrder(data: any) {
    const res = await api.post<ApiResponse<IOrder>>("/orders", data);
    return res.data.data;
  },

  async getMyOrders(page = 1) {
    const res = await api.get<ApiResponse<IOrder[]>>("/orders/my-orders", {
      params: { page },
    });
    return {
      orders: res.data.data,
      meta: res.data.meta,
    };
  },

  async getOrderById(id: string) {
    const res = await api.get<ApiResponse<IOrder>>(`/orders/${id}`);
    return res.data.data;
  },

  async trackOrder(orderNumber: string, identifier: string) {
    const res = await api.post<ApiResponse<IOrder>>("/orders/track", {
      orderNumber,
      identifier,
    });
    return res.data.data;
  },

  async uploadReceipt(orderId: string, file: File, bankName?: string) {
    const formData = new FormData();
    formData.append("receipt", file);
    if (bankName) formData.append("bankName", bankName);

    const res = await api.post<ApiResponse<IOrder>>(
      `/orders/${orderId}/upload-receipt`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data.data;
  },

  // Admin
  async listAdminOrders(params?: any) {
    const res = await api.get<ApiResponse<IOrder[]>>("/orders/admin/all", { params });
    return {
      orders: res.data.data,
      meta: res.data.meta,
    };
  },

  async updateOrderStatus(
    orderId: string,
    data: { status: string; trackingNumber?: string; comment?: string }
  ) {
    const res = await api.patch<ApiResponse<IOrder>>(
      `/orders/admin/${orderId}/status`,
      data
    );
    return res.data.data;
  },

  async verifyPayment(orderId: string, isApproved: boolean, rejectionReason?: string) {
    const res = await api.patch<ApiResponse<IOrder>>(
      `/orders/admin/${orderId}/verify-payment`,
      { isApproved, rejectionReason }
    );
    return res.data.data;
  },
};

