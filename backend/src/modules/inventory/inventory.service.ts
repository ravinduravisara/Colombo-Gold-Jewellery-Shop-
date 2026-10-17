import { Product } from "../products/product.model";
import { InventoryMovement } from "./inventoryMovement.model";
import { ApiError } from "../../utils/ApiError";
import { getPagination, createPaginationMeta } from "../../utils/pagination";

export class InventoryService {
  static async getInventoryStatus(query: any) {
    const { page, limit, skip } = getPagination(query, 15);
    const filter: any = { isArchived: false };

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search.trim(), $options: "i" } },
        { sku: { $regex: query.search.trim(), $options: "i" } },
      ];
    }

    if (query.status === "low") {
      filter.$expr = { $lte: ["$stockQuantity", "$lowStockThreshold"] };
    } else if (query.status === "out") {
      filter.stockQuantity = { $lte: 0 };
    }

    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .select("name sku regularPrice stockQuantity lowStockThreshold images variants isPublished")
        .sort({ stockQuantity: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const enriched = products.map((p) => {
      let status: "in_stock" | "low_stock" | "out_of_stock" = "in_stock";
      if (p.stockQuantity <= 0) status = "out_of_stock";
      else if (p.stockQuantity <= p.lowStockThreshold) status = "low_stock";

      return {
        ...p,
        status,
      };
    });

    return {
      inventory: enriched,
      meta: createPaginationMeta(total, page, limit),
    };
  }

  static async adjustStock(
    productId: string,
    newQuantity: number,
    reason: string,
    adminUserId: string,
    variantId?: string
  ) {
    const product = await Product.findById(productId);
    if (!product) throw ApiError.notFound("Product not found");

    let prevStock = product.stockQuantity;
    let sku = product.sku;

    if (variantId && product.variants) {
      const v = product.variants.find((item: any) => item._id?.toString() === variantId);
      if (!v) throw ApiError.notFound("Variant not found");
      prevStock = v.stockQuantity;
      sku = v.sku;
      v.stockQuantity = newQuantity;
    } else {
      product.stockQuantity = newQuantity;
    }

    await product.save();

    const movement = await InventoryMovement.create({
      product: product._id,
      productName: product.name,
      sku,
      type: "adjustment",
      quantity: newQuantity - prevStock,
      previousStock: prevStock,
      newStock: newQuantity,
      reason: reason || "Manual Admin Adjustment",
      performedBy: adminUserId,
    });

    return { product, movement };
  }

  static async getMovements(query: any) {
    const { page, limit, skip } = getPagination(query, 20);
    const filter: any = {};

    if (query.productId) filter.product = query.productId;
    if (query.type) filter.type = query.type;

    const [total, movements] = await Promise.all([
      InventoryMovement.countDocuments(filter),
      InventoryMovement.find(filter)
        .populate("performedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    return {
      movements,
      meta: createPaginationMeta(total, page, limit),
    };
  }
}
