export interface IProductImage {
  _id?: string;
  url: string;
  publicId?: string;
  isPrimary: boolean;
  altText?: string;
}

export interface IProductVariant {
  _id?: string;
  sku: string;
  name: string;
  price?: number; // In LKR cents
  discountPrice?: number;
  stockQuantity: number;
  attributes: Record<string, string>;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder: number;
  isActive: boolean;
  itemCount?: number;
}

export interface ICollection {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  bannerImage?: string;
  thumbnailImage?: string;
  isFeatured: boolean;
  displayOrder: number;
  isActive: boolean;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  category: ICategory | string;
  collectionRef?: ICollection | string;
  shortDescription?: string;
  description: string;
  regularPrice: number; // In LKR minor units (cents)
  discountPrice?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  images: IProductImage[];
  variants: IProductVariant[];
  specifications: Record<string, string>;
  warrantyMonths: number;
  warrantyDetails?: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isPublished: boolean;
  isArchived: boolean;
  salesCount: number;
  rating: number;
  reviewCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICartItem {
  _id: string;
  productId: string;
  name: string;
  slug: string;
  sku: string;
  image: string;
  variantId?: string;
  variantName?: string;
  price: number;
  quantity: number;
  availableStock: number;
  isOutOfStock: boolean;
}

