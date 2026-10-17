import { api } from "./api";
import { ApiResponse } from "@/types/api";

export const settingsService = {
  async getPublicSettings() {
    const res = await api.get<ApiResponse<any>>("/settings/public");
    return res.data.data;
  },

  async getAdminSettings() {
    const res = await api.get<ApiResponse<any>>("/settings/admin");
    return res.data.data;
  },

  async updateSettings(data: any) {
    const res = await api.patch<ApiResponse<any>>("/settings/admin", data);
    return res.data.data;
  },

  async uploadLogo(file: File) {
    const formData = new FormData();
    formData.append("logo", file);
    const res = await api.post<ApiResponse<any>>("/settings/admin/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },
};

