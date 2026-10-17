import { api } from "./api";
import { ICategory, ICollection } from "@/types/product";
import { ApiResponse } from "@/types/api";

export const categoryService = {
  async getCategories(all = false) {
    const res = await api.get<ApiResponse<ICategory[]>>("/categories", {
      params: { all: all ? "true" : undefined },
    });
    return res.data.data;
  },

  async getCategoryBySlug(slug: string) {
    const res = await api.get<ApiResponse<ICategory>>(`/categories/${slug}`);
    return res.data.data;
  },

  async getCollections(all = false) {
    const res = await api.get<ApiResponse<ICollection[]>>("/collections", {
      params: { all: all ? "true" : undefined },
    });
    return res.data.data;
  },

  async getCollectionBySlug(slug: string) {
    const res = await api.get<ApiResponse<ICollection>>(`/collections/${slug}`);
    return res.data.data;
  },

  // Admin
  async createCategory(data: Partial<ICategory>) {
    const res = await api.post<ApiResponse<ICategory>>("/categories", data);
    return res.data.data;
  },

  async updateCategory(id: string, data: Partial<ICategory>) {
    const res = await api.patch<ApiResponse<ICategory>>(`/categories/${id}`, data);
    return res.data.data;
  },

  async deleteCategory(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/categories/${id}`);
    return res.data;
  },

  async createCollection(data: Partial<ICollection>) {
    const res = await api.post<ApiResponse<ICollection>>("/collections", data);
    return res.data.data;
  },

  async updateCollection(id: string, data: Partial<ICollection>) {
    const res = await api.patch<ApiResponse<ICollection>>(`/collections/${id}`, data);
    return res.data.data;
  },

  async deleteCollection(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/collections/${id}`);
    return res.data;
  },
};
