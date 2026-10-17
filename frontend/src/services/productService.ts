import { api } from "./api";
import { IProduct } from "@/types/product";
import { ApiResponse } from "@/types/api";

export interface ProductFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  sort?: "price-asc" | "price-desc" | "newest" | "best-selling" | "name";
  all?: boolean;
}

export const productService = {
  async getProducts(params?: ProductFilterParams) {
    const res = await api.get<ApiResponse<IProduct[]>>("/products", { params });
    return {
      products: res.data.data,
      meta: res.data.meta,
    };
  },

  async getProductBySlug(slug: string) {
    const res = await api.get<ApiResponse<{ product: IProduct; relatedProducts: IProduct[] }>>(
      `/products/slug/${slug}`
    );
    return res.data.data;
  },

  async getProductById(id: string) {
    const res = await api.get<ApiResponse<IProduct>>(`/products/id/${id}`);
    return res.data.data;
  },

  // Admin
  async createProduct(data: Partial<IProduct>) {
    const res = await api.post<ApiResponse<IProduct>>("/products", data);
    return res.data.data;
  },

  async updateProduct(id: string, data: Partial<IProduct>) {
    const res = await api.patch<ApiResponse<IProduct>>(`/products/${id}`, data);
    return res.data.data;
  },

  async archiveProduct(id: string) {
    const res = await api.patch<ApiResponse<IProduct>>(`/products/${id}/archive`);
    return res.data.data;
  },

  async uploadProductImage(file: File) {
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.post<ApiResponse<{ url: string; publicId?: string }>>(
      "/products/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data.data;
  },
};

