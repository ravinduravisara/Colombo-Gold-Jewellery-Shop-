import mongoose, { Document, Schema } from "mongoose";

export interface IProductImage {
  url: string;
  publicId?: string;
  isPrimary: boolean;
  altText?: string;
}

export interface IProductVariant {
  _id?: string;
  sku: string;
  name: string; // e.g., "Size: 2.6 / 24K Micro Gold"
  price?: number; // In LKR cents (if overrides regularPrice)
  discountPrice?: number;
  stockQuantity: number;
  attributes: Record<string, string>; // e.g. { size: "2.6", finish: "24K Micro Gold" }
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  category: mongoose.Types.ObjectId;
  collectionRef?: mongoose.Types.ObjectId;
  shortDescription?: string;
  description: string;
  regularPrice: number; // Stored in LKR minor units (cents)
  discountPrice?: number; // Stored in LKR minor units (cents)
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
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    publicId: String,
    isPrimary: { type: Boolean, default: false },
    altText: String,
  },
  { _id: true }
);

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    sku: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number },
    discountPrice: { type: Number },
    stockQuantity: { type: Number, required: true, default: 0, min: 0 },
    attributes: { type: Map, of: String, default: {} },
  },
  { _id: true }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    sku: {
      type: String,
      required: [true, "Product SKU is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },
    collectionRef: {
      type: Schema.Types.ObjectId,
      ref: "Collection",
      index: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    regularPrice: {
      type: Number,
      required: [true, "Regular price is required"],
      min: [0, "Price cannot be negative"],
      index: true,
    },
    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
      index: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock cannot be negative"],
      index: true,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
    images: {
      type: [ProductImageSchema],
      validate: [(val: any[]) => val.length > 0, "At least one product image is required"],
    },
    variants: [ProductVariantSchema],
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    warrantyMonths: {
      type: Number,
      default: 6,
    },
    warrantyDetails: {
      type: String,
      default: "6 Months Colombo Gold Covering Warranty against natural tarnishing.",
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
      index: true,
    },
    isNewArrival: {
      type: Boolean,
      default: true,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    salesCount: {
      type: Number,
      default: 0,
      index: true,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    seoTitle: String,
    seoDescription: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for high-speed searches and filters
ProductSchema.index({ name: "text", shortDescription: "text", description: "text" });
ProductSchema.index({ category: 1, isPublished: 1, isArchived: 1, regularPrice: 1 });

export const Product = mongoose.model<IProduct>("Product", ProductSchema);

