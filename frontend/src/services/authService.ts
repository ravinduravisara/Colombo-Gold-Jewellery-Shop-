import { api } from "./api";
import { IUser } from "@/types/user";
import { ApiResponse } from "@/types/api";

export const authService = {
  async register(data: { name: string; email: string; password: string; phone?: string }) {
    const res = await api.post<ApiResponse<{ user: IUser; accessToken: string }>>(
      "/auth/register",
      data
    );
    if (res.data.data?.accessToken && typeof window !== "undefined") {
      localStorage.setItem("cgc_token", res.data.data.accessToken);
    }
    return res.data.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await api.post<ApiResponse<{ user: IUser; accessToken: string }>>(
      "/auth/login",
      data
    );
    if (res.data.data?.accessToken && typeof window !== "undefined") {
      localStorage.setItem("cgc_token", res.data.data.accessToken);
    }
    return res.data.data;
  },

  async getMe() {
    const res = await api.get<ApiResponse<IUser>>("/auth/me");
    return res.data.data;
  },

  async logout() {
    await api.post("/auth/logout");
    if (typeof window !== "undefined") {
      localStorage.removeItem("cgc_token");
    }
  },

  async forgotPassword(email: string) {
    const res = await api.post<ApiResponse<null>>("/auth/forgot-password", { email });
    return res.data;
  },

  async resetPassword(data: { token: string; newPassword: string }) {
    const res = await api.post<ApiResponse<null>>("/auth/reset-password", data);
    return res.data;
  },
};

