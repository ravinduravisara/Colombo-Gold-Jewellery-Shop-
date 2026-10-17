import { api } from "./api";
import { IUser, IAddress } from "@/types/user";
import { ApiResponse, PaginatedResponse } from "@/types/api";

export const userService = {
  async updateProfile(data: { name?: string; phone?: string }) {
    const res = await api.patch<ApiResponse<IUser>>("/users/profile", data);
    return res.data.data;
  },

  async addAddress(data: Omit<IAddress, "_id">) {
    const res = await api.post<ApiResponse<IAddress[]>>("/users/addresses", data);
    return res.data.data;
  },

  async updateAddress(id: string, data: Partial<IAddress>) {
    const res = await api.patch<ApiResponse<IAddress[]>>(`/users/addresses/${id}`, data);
    return res.data.data;
  },

  async deleteAddress(id: string) {
    const res = await api.delete<ApiResponse<IAddress[]>>(`/users/addresses/${id}`);
    return res.data.data;
  },

  // Admin APIs
  async listCustomers(params?: { page?: number; limit?: number; search?: string }) {
    const res = await api.get<PaginatedResponse<IUser>>("/users/admin/customers", { params });
    return res.data;
  },

  async listStaff() {
    const res = await api.get<ApiResponse<IUser[]>>("/users/admin/staff");
    return res.data.data;
  },

  async createStaff(data: { name: string; email: string; password: string; role: "admin" | "staff" }) {
    const res = await api.post<ApiResponse<IUser>>("/users/admin/staff", data);
    return res.data.data;
  },

  async toggleStatus(id: string) {
    const res = await api.patch<ApiResponse<IUser>>(`/users/admin/status/${id}`);
    return res.data.data;
  },
};

