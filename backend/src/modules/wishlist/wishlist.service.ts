import { Wishlist } from "./wishlist.model";
import { Product } from "../products/product.model";
import { ApiError } from "../../utils/ApiError";

export class WishlistService {
  static async getWishlist(userId: string) {
    let wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: "products",
      select: "name slug sku regularPrice discountPrice stockQuantity images isPublished isArchived",
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    // Filter out archived products
    const validProducts = (wishlist.products as any[]).filter(
      (p) => p && !p.isArchived && p.isPublished
    );

    return validProducts;
  }

  static async toggleProduct(userId: string, productId: string) {
    const product = await Product.findById(productId);
    if (!product || product.isArchived) {
      throw ApiError.notFound("Product not found");
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    const index = wishlist.products.findIndex((p) => p.toString() === productId);
    let isAdded = false;

    if (index > -1) {
      wishlist.products.splice(index, 1);
      isAdded = false;
    } else {
      wishlist.products.push(product._id as any);
      isAdded = true;
    }

    await wishlist.save();
    return { isAdded, count: wishlist.products.length };
  }
}

