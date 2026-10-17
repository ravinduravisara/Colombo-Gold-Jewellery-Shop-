import { api } from "./api";
import { ApiResponse, PaginatedResponse } from "@/types/api";

export interface ICoupon {
  _id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface IShippingZone {
  _id: string;
  name: string;
  districts: string[];
  baseRate: number;
  estimatedDeliveryDays: string;
  freeShippingThreshold?: number;
  isActive: boolean;
}

export interface IBanner {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  position: "home-hero" | "collection-banner" | "promo-strip";
  displayOrder: number;
  isActive: boolean;
  validUntil?: string;
}

export interface IGalleryItem {
  _id: string;
  title: string;
  mediaType: "image" | "tiktok_video" | "reel";
  mediaUrl: string;
  thumbnailUrl?: string;
  externalUrl?: string;
  caption?: string;
  tags?: string[];
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
}

export interface IContentPage {
  _id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  updatedAt: string;
}

export interface IEnquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "in_progress" | "resolved" | "archived";
  responseNotes?: string;
  createdAt: string;
}

export interface IReview {
  _id: string;
  user: { _id: string; name: string; email: string };
  product: { _id: string; name: string; slug: string; images?: Array<{ url: string }> };
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface IAuditLog {
  _id: string;
  user: { _id: string; name: string; email: string; role: string };
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  createdAt: string;
}

export interface IInventoryStatus {
  totalProducts: number;
  totalTrackedVariants: number;
  outOfStockCount: number;
  lowStockCount: number;
  lowStockItems: Array<{
    _id: string;
    productTitle: string;
    sku: string;
    stockQuantity: number;
    lowStockThreshold: number;
  }>;
}

export interface IInventoryMovement {
  _id: string;
  product: { _id: string; name: string };
  type: "in" | "out" | "adjustment";
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  reference?: string;
  performedBy?: { name: string; email: string };
  createdAt: string;
}

export const adminService = {
  // Coupons
  async getCoupons() {
    const res = await api.get<ApiResponse<ICoupon[]>>("/coupons/admin/all");
    return res.data.data;
  },
  async createCoupon(data: Partial<ICoupon>) {
    const res = await api.post<ApiResponse<ICoupon>>("/coupons/admin", data);
    return res.data.data;
  },
  async updateCoupon(id: string, data: Partial<ICoupon>) {
    const res = await api.patch<ApiResponse<ICoupon>>(`/coupons/admin/${id}`, data);
    return res.data.data;
  },
  async deleteCoupon(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/coupons/admin/${id}`);
    return res.data.data;
  },

  // Shipping
  async getShippingZones() {
    const res = await api.get<ApiResponse<IShippingZone[]>>("/shipping");
    return res.data.data;
  },
  async createShippingZone(data: Partial<IShippingZone>) {
    const res = await api.post<ApiResponse<IShippingZone>>("/shipping/admin", data);
    return res.data.data;
  },
  async updateShippingZone(id: string, data: Partial<IShippingZone>) {
    const res = await api.patch<ApiResponse<IShippingZone>>(`/shipping/admin/${id}`, data);
    return res.data.data;
  },
  async deleteShippingZone(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/shipping/admin/${id}`);
    return res.data.data;
  },

  // Banners
  async getBanners() {
    const res = await api.get<ApiResponse<IBanner[]>>("/banners/admin/all");
    return res.data.data;
  },
  async createBanner(data: Partial<IBanner>) {
    const res = await api.post<ApiResponse<IBanner>>("/banners/admin", data);
    return res.data.data;
  },
  async updateBanner(id: string, data: Partial<IBanner>) {
    const res = await api.patch<ApiResponse<IBanner>>(`/banners/admin/${id}`, data);
    return res.data.data;
  },
  async deleteBanner(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/banners/admin/${id}`);
    return res.data.data;
  },
  async uploadBannerImage(file: File) {
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.post<ApiResponse<{ url: string; publicId?: string }>>(
      "/banners/admin/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.data;
  },

  // Gallery
  async getGallery() {
    const res = await api.get<ApiResponse<IGalleryItem[]>>("/gallery/admin/all");
    return res.data.data;
  },
  async createGalleryItem(data: Partial<IGalleryItem>) {
    const res = await api.post<ApiResponse<IGalleryItem>>("/gallery/admin", data);
    return res.data.data;
  },
  async updateGalleryItem(id: string, data: Partial<IGalleryItem>) {
    const res = await api.patch<ApiResponse<IGalleryItem>>(`/gallery/admin/${id}`, data);
    return res.data.data;
  },
  async deleteGalleryItem(id: string) {
    const res = await api.delete<ApiResponse<null>>(`/gallery/admin/${id}`);
    return res.data.data;
  },

  // Content Pages
  async getContentPages() {
    const res = await api.get<ApiResponse<IContentPage[]>>("/content/admin/all");
    return res.data.data;
  },
  async updateContentPage(slug: string, data: Partial<IContentPage>) {
    const res = await api.patch<ApiResponse<IContentPage>>(`/content/admin/${slug}`, data);
    return res.data.data;
  },

  // Reviews
  async getReviews(params?: { status?: string; page?: number }) {
    const res = await api.get<ApiResponse<IReview[]>>("/reviews/admin/all", { params });
    return {
      reviews: res.data.data,
      meta: res.data.meta,
    };
  },
  async updateReviewStatus(id: string, status: "approved" | "rejected") {
    const res = await api.patch<ApiResponse<IReview>>(`/reviews/admin/${id}/status`, { status });
    return res.data.data;
  },

  // Enquiries
  async getEnquiries(params?: { status?: string; page?: number }) {
    const res = await api.get<ApiResponse<IEnquiry[]>>("/enquiries/admin/all", { params });
    return {
      enquiries: res.data.data,
      meta: res.data.meta,
    };
  },
  async respondEnquiry(id: string, responseNotes: string, status: string) {
    const res = await api.patch<ApiResponse<IEnquiry>>(`/enquiries/admin/${id}/respond`, {
      responseNotes,
      status,
    });
    return res.data.data;
  },

  // Inventory
  async getInventoryStatus() {
    const res = await api.get<ApiResponse<IInventoryStatus>>("/inventory/status");
    return res.data.data;
  },
  async adjustInventory(data: {
    productId: string;
    variantId?: string;
    adjustment: number;
    reason: string;
    type: "in" | "out" | "adjustment";
  }) {
    const res = await api.post<ApiResponse<any>>("/inventory/adjust", data);
    return res.data.data;
  },
  async getInventoryMovements(page = 1) {
    const res = await api.get<ApiResponse<IInventoryMovement[]>>("/inventory/movements", {
      params: { page },
    });
    return {
      movements: res.data.data,
      meta: res.data.meta,
    };
  },

  // Audit Logs
  async getAuditLogs(params?: { page?: number; limit?: number }) {
    const res = await api.get<ApiResponse<IAuditLog[]>>("/audit-logs", { params });
    return {
      logs: res.data.data,
      meta: res.data.meta,
    };
  },
};

