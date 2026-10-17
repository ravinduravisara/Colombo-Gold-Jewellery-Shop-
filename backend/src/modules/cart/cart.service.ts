import { Cart, ICart } from "./cart.model";
import { Product } from "../products/product.model";
import { ApiError } from "../../utils/ApiError";

export class CartService {
  static async getCart(userId?: string, guestSessionId?: string) {
    if (!userId && !guestSessionId) {
      return { items: [], subtotal: 0 };
    }

    const query = userId ? { user: userId } : { guestSessionId };
    let cart = await Cart.findOne(query).populate({
      path: "items.product",
      select: "name slug sku regularPrice discountPrice stockQuantity images variants isPublished isArchived",
    });

    if (!cart) {
      return { items: [], subtotal: 0 };
    }

    // Filter out archived or unpublished products and recalculate prices
    const validItems: any[] = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product: any = item.product;
      if (!product || product.isArchived || !product.isPublished) {
        continue;
      }

      let price = product.discountPrice || product.regularPrice;
      let variantName = "";
      let availableStock = product.stockQuantity;

      if (item.variantId && product.variants?.length > 0) {
        const variant = product.variants.find((v: any) => v._id?.toString() === item.variantId);
        if (variant) {
          variantName = variant.name;
          if (variant.price) price = variant.discountPrice || variant.price;
          availableStock = variant.stockQuantity;
        }
      }

      const quantity = Math.min(item.quantity, Math.max(availableStock, 1));
      subtotal += price * quantity;

      validItems.push({
        _id: item._id,
        productId: product._id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        image: product.images?.[0]?.url || "",
        variantId: item.variantId,
        variantName,
        price, // in minor units LKR cents
        quantity,
        availableStock,
        isOutOfStock: availableStock <= 0,
      });
    }

    return {
      _id: cart._id,
      items: validItems,
      subtotal,
    };
  }

  static async addItem(
    data: { productId: string; variantId?: string; quantity: number },
    userId?: string,
    guestSessionId?: string
  ) {
    const product = await Product.findById(data.productId);
    if (!product || product.isArchived || !product.isPublished) {
      throw ApiError.notFound("Product is not available for purchase");
    }

    let availableStock = product.stockQuantity;
    if (data.variantId && product.variants) {
      const variant = product.variants.find((v: any) => v._id?.toString() === data.variantId);
      if (variant) availableStock = variant.stockQuantity;
    }

    if (availableStock < data.quantity) {
      throw ApiError.badRequest(`Insufficient stock. Only ${availableStock} available.`);
    }

    const query = userId ? { user: userId } : { guestSessionId };
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({
        user: userId,
        guestSessionId: userId ? undefined : guestSessionId,
        items: [],
      });
    }

    const existingIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === data.productId &&
        (item.variantId || "") === (data.variantId || "")
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + data.quantity;
      if (newQty > availableStock) {
        throw ApiError.badRequest(`Cannot add more. Reached available stock of ${availableStock}.`);
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({
        product: product._id as any,
        variantId: data.variantId,
        quantity: data.quantity,
      });
    }

    await cart.save();
    return this.getCart(userId, guestSessionId);
  }

  static async updateQuantity(
    itemId: string,
    quantity: number,
    userId?: string,
    guestSessionId?: string
  ) {
    const query = userId ? { user: userId } : { guestSessionId };
    const cart = await Cart.findOne(query);
    if (!cart) throw ApiError.notFound("Cart not found");

    const item = cart.items.find((i: any) => i._id?.toString() === itemId);
    if (!item) throw ApiError.notFound("Item not found in cart");

    if (quantity <= 0) {
      cart.items = cart.items.filter((i: any) => i._id?.toString() !== itemId);
    } else {
      // Re-verify stock
      const product = await Product.findById(item.product);
      if (product) {
        let maxStock = product.stockQuantity;
        if (item.variantId && product.variants) {
          const variant = product.variants.find((v: any) => v._id?.toString() === item.variantId);
          if (variant) maxStock = variant.stockQuantity;
        }
        if (quantity > maxStock) {
          throw ApiError.badRequest(`Only ${maxStock} items available in stock.`);
        }
      }
      item.quantity = quantity;
    }

    await cart.save();
    return this.getCart(userId, guestSessionId);
  }

  static async removeItem(itemId: string, userId?: string, guestSessionId?: string) {
    const query = userId ? { user: userId } : { guestSessionId };
    const cart = await Cart.findOne(query);
    if (!cart) throw ApiError.notFound("Cart not found");

    cart.items = cart.items.filter((i: any) => i._id?.toString() !== itemId);
    await cart.save();
    return this.getCart(userId, guestSessionId);
  }

  static async clearCart(userId?: string, guestSessionId?: string) {
    const query = userId ? { user: userId } : { guestSessionId };
    await Cart.findOneAndDelete(query);
    return { items: [], subtotal: 0 };
  }

  static async mergeGuestCart(userId: string, guestSessionId: string) {
    if (!guestSessionId) return;

    const guestCart = await Cart.findOne({ guestSessionId });
    if (!guestCart || guestCart.items.length === 0) return;

    let userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      guestCart.user = userId as any;
      guestCart.guestSessionId = undefined;
      await guestCart.save();
      return;
    }

    for (const gItem of guestCart.items) {
      const existing = userCart.items.find(
        (uItem) =>
          uItem.product.toString() === gItem.product.toString() &&
          (uItem.variantId || "") === (gItem.variantId || "")
      );
      if (existing) {
        existing.quantity += gItem.quantity;
      } else {
        userCart.items.push(gItem);
      }
    }

    await userCart.save();
    await Cart.findByIdAndDelete(guestCart._id);
  }
}
