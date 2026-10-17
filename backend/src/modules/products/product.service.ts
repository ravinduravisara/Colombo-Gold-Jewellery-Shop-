import { Product, IProduct } from "./product.model";
import { Category } from "../categories/category.model";
import { Collection } from "../collections/collection.model";
import { generateSlug } from "../../utils/slugify";
import { ApiError } from "../../utils/ApiError";
import { getPagination, createPaginationMeta } from "../../utils/pagination";

export interface ProductQueryFilters {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  collection?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  featured?: string;
  newArrival?: string;
  bestSeller?: string;
  sort?: "price-asc" | "price-desc" | "newest" | "best-selling" | "name";
  all?: string; // For admin (include unpublished/archived)
}

export class ProductService {
  static async getAll(query: ProductQueryFilters) {
    const { page, limit, skip } = getPagination(query, 12);
    const filter: any = {};

    // Standard public storefront hides archived and unpublished products
    if (query.all !== "true") {
      filter.isPublished = true;
      filter.isArchived = false;
    } else {
      // Admin might specify if they want only non-archived
      filter.isArchived = false;
    }

    // Search query
    if (query.search && query.search.trim()) {
      filter.$or = [
        { name: { $regex: query.search.trim(), $options: "i" } },
        { sku: { $regex: query.search.trim(), $options: "i" } },
        { shortDescription: { $regex: query.search.trim(), $options: "i" } },
      ];
    }

    // Category filter (support category ID or slug)
    if (query.category) {
      if (query.category.match(/^[0-9a-fA-F]{24}$/)) {
        filter.category = query.category;
      } else {
        const cat = await Category.findOne({ slug: query.category.toLowerCase() });
        if (cat) filter.category = cat._id;
      }
    }

    // Collection filter (support collection ID or slug)
    if (query.collection) {
      if (query.collection.match(/^[0-9a-fA-F]{24}$/)) {
        filter.collectionRef = query.collection;
      } else {
        const col = await Collection.findOne({ slug: query.collection.toLowerCase() });
        if (col) filter.collectionRef = col._id;
      }
    }

    // Price range filter (stored in minor units cents)
    if (query.minPrice || query.maxPrice) {
      filter.regularPrice = {};
      if (query.minPrice) {
        filter.regularPrice.$gte = parseInt(query.minPrice, 10);
      }
      if (query.maxPrice) {
        filter.regularPrice.$lte = parseInt(query.maxPrice, 10);
      }
    }

    // Stock availability
    if (query.inStock === "true") {
      filter.stockQuantity = { $gt: 0 };
    }

    // Highlights
    if (query.featured === "true") filter.isFeatured = true;
    if (query.newArrival === "true") filter.isNewArrival = true;
    if (query.bestSeller === "true") filter.isBestSeller = true;

    // Sorting
    let sortOptions: any = { createdAt: -1 };
    switch (query.sort) {
      case "price-asc":
        sortOptions = { regularPrice: 1 };
        break;
      case "price-desc":
        sortOptions = { regularPrice: -1 };
        break;
      case "best-selling":
        sortOptions = { salesCount: -1, createdAt: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "newest":
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .populate("category", "name slug")
        .populate("collectionRef", "name slug")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return {
      products,
      meta: createPaginationMeta(total, page, limit),
    };
  }

  static async getBySlug(slug: string) {
    const product = await Product.findOne({
      slug: slug.toLowerCase(),
      isArchived: false,
    })
      .populate("category", "name slug")
      .populate("collectionRef", "name slug");

    if (!product) throw ApiError.notFound("Product not found");

    // Retrieve related products in same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isPublished: true,
      isArchived: false,
    })
      .limit(4)
      .lean();

    return { product, relatedProducts };
  }

  static async getById(id: string) {
    const product = await Product.findById(id)
      .populate("category", "name slug")
      .populate("collectionRef", "name slug");
    if (!product) throw ApiError.notFound("Product not found");
    return product;
  }

  static async create(data: Partial<IProduct>) {
    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name!);
    
    // Check slug collision
    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      throw ApiError.conflict(`Product with slug '${slug}' already exists`);
    }

    // Check SKU collision
    if (data.sku) {
      const existingSku = await Product.findOne({ sku: data.sku.toUpperCase() });
      if (existingSku) {
        throw ApiError.conflict(`Product SKU '${data.sku.toUpperCase()}' is already taken`);
      }
    } else {
      // Auto-generate SKU
      data.sku = `CGC-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    const product = await Product.create({
      ...data,
      slug,
      sku: data.sku.toUpperCase(),
    });

    return product;
  }

  static async update(id: string, data: Partial<IProduct>) {
    const product = await Product.findById(id);
    if (!product) throw ApiError.notFound("Product not found");

    if (data.name && (!data.slug || data.slug === product.slug)) {
      data.slug = generateSlug(data.name);
    }

    if (data.sku) {
      data.sku = data.sku.toUpperCase();
    }

    Object.assign(product, data);
    await product.save();
    return product;
  }

  static async archive(id: string) {
    const product = await Product.findByIdAndUpdate(
      id,
      { isArchived: true, isPublished: false },
      { new: true }
    );
    if (!product) throw ApiError.notFound("Product not found");
    return product;
  }

  static async restore(id: string) {
    const product = await Product.findByIdAndUpdate(
      id,
      { isArchived: false, isPublished: true },
      { new: true }
    );
    if (!product) throw ApiError.notFound("Product not found");
    return product;
  }

  static async deletePermanent(id: string) {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) throw ApiError.notFound("Product not found");
    return deleted;
  }
}

