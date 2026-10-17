import mongoose from "mongoose";
import { Order, IOrder, IOrderItem, IOrderShippingAddress } from "./order.model";
import { Product } from "../products/product.model";
import { Coupon } from "../coupons/coupon.model";
import { InventoryMovement } from "../inventory/inventoryMovement.model";
import { ShippingZone } from "../shipping/shipping.model";
import { WebsiteSettings } from "../settings/settings.model";
import { CartService } from "../cart/cart.service";
import { EmailService } from "../../services/email.service";
import { NotificationService } from "../../services/notification.service";
import { generateOrderNumber } from "../../utils/generateOrderNumber";
import { ApiError } from "../../utils/ApiError";
import { getPagination, createPaginationMeta } from "../../utils/pagination";

export interface CreateOrderInput {
  customerEmail: string;
  customerPhone: string;
  shippingAddress: IOrderShippingAddress;
  items: Array<{ productId: string; variantId?: string; quantity: number }>;
  paymentMethod: "cod" | "bank_transfer" | "card";
  couponCode?: string;
  notes?: string;
  guestSessionId?: string;
}

export class OrderService {
  static async createOrder(data: CreateOrderInput, userId?: string) {
    if (!data.items || data.items.length === 0) {
      throw ApiError.badRequest("Cannot place order with empty items");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const settings = await WebsiteSettings.findOne().session(session);
      const freeShippingThreshold = settings?.freeShippingThreshold ?? 1500000; // Rs 15,000 default

      let subtotalAmount = 0;
      const orderItems: IOrderItem[] = [];
      const stockUpdates: Array<{ product: any; variantId?: string; deductQty: number; prevStock: number }> = [];

      // 1. Verify every item and lock inventory
      for (const reqItem of data.items) {
        const product = await Product.findById(reqItem.productId).session(session);
        if (!product || product.isArchived || !product.isPublished) {
          throw ApiError.badRequest(`Product '${reqItem.productId}' is no longer available.`);
        }

        let itemPrice = product.discountPrice || product.regularPrice;
        let variantName = "";
        let availableStock = product.stockQuantity;

        if (reqItem.variantId && product.variants?.length > 0) {
          const variant = product.variants.find((v: any) => v._id?.toString() === reqItem.variantId);
          if (!variant) {
            throw ApiError.badRequest(`Variant not found for product '${product.name}'`);
          }
          variantName = variant.name;
          if (variant.price) itemPrice = variant.discountPrice || variant.price;
          availableStock = variant.stockQuantity;
        }

        if (availableStock < reqItem.quantity) {
          throw ApiError.badRequest(
            `Insufficient stock for '${product.name}'. Available: ${availableStock}, Requested: ${reqItem.quantity}`
          );
        }

        const lineTotal = itemPrice * reqItem.quantity;
        subtotalAmount += lineTotal;

        orderItems.push({
          product: product._id as any,
          name: product.name,
          sku: product.sku,
          variantId: reqItem.variantId,
          variantName,
          quantity: reqItem.quantity,
          price: itemPrice,
          image: product.images?.[0]?.url || "",
        });

        stockUpdates.push({
          product,
          variantId: reqItem.variantId,
          deductQty: reqItem.quantity,
          prevStock: availableStock,
        });
      }

      // 2. Validate Coupon if provided
      let discountAmount = 0;
      let appliedCouponCode: string | undefined;

      if (data.couponCode) {
        const coupon = await Coupon.findOne({
          code: data.couponCode.toUpperCase(),
          isActive: true,
          expiryDate: { $gt: new Date() },
        }).session(session);

        if (coupon) {
          if (subtotalAmount >= coupon.minPurchaseAmount) {
            if (coupon.discountType === "percentage") {
              discountAmount = Math.round((subtotalAmount * coupon.discountValue) / 100);
              if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
                discountAmount = coupon.maxDiscountAmount;
              }
            } else {
              discountAmount = coupon.discountValue;
            }
            discountAmount = Math.min(discountAmount, subtotalAmount);
            appliedCouponCode = coupon.code;
            coupon.usageCount += 1;
            await coupon.save({ session });
          }
        }
      }

      // 3. Calculate Shipping Fee based on District
      let shippingFee = settings?.defaultDeliveryFee ?? 35000; // Rs 350 default
      if (data.shippingAddress?.district) {
        const zone = await ShippingZone.findOne({
          district: new RegExp(`^${data.shippingAddress.district.trim()}$`, "i"),
          isActive: true,
        }).session(session);
        if (zone) {
          shippingFee = zone.deliveryFee;
        }
      }

      // Free shipping threshold check
      if (subtotalAmount >= freeShippingThreshold) {
        shippingFee = 0;
      }

      const totalAmount = Math.max(0, subtotalAmount - discountAmount + shippingFee);
      const orderNumber = generateOrderNumber();

      // 4. Deduct inventory and record stock movements
      for (const update of stockUpdates) {
        const newStock = update.prevStock - update.deductQty;
        
        if (update.variantId && update.product.variants) {
          const v = update.product.variants.find((v: any) => v._id?.toString() === update.variantId);
          if (v) v.stockQuantity = newStock;
        } else {
          update.product.stockQuantity = newStock;
        }

        update.product.salesCount = (update.product.salesCount || 0) + update.deductQty;
        await update.product.save({ session });

        // Record movement
        await InventoryMovement.create(
          [
            {
              product: update.product._id,
              productName: update.product.name,
              sku: update.product.sku,
              type: "order_deduct",
              quantity: update.deductQty,
              previousStock: update.prevStock,
              newStock,
              referenceOrder: orderNumber,
              reason: `Customer Order #${orderNumber}`,
            },
          ],
          { session }
        );

        // Low stock alert check
        if (newStock <= update.product.lowStockThreshold) {
          NotificationService.notifyLowStock(update.product.name, newStock);
        }
      }

      // 5. Create Order
      const initialPaymentStatus =
        data.paymentMethod === "bank_transfer" ? "pending_verification" : "pending";

      const [order] = await Order.create(
        [
          {
            orderNumber,
            customer: userId,
            customerEmail: data.customerEmail,
            customerPhone: data.customerPhone,
            shippingAddress: data.shippingAddress,
            items: orderItems,
            paymentMethod: data.paymentMethod,
            paymentStatus: initialPaymentStatus,
            orderStatus: "pending",
            subtotalAmount,
            discountAmount,
            couponCode: appliedCouponCode,
            shippingFee,
            totalAmount,
            notes: data.notes,
            statusHistory: [
              {
                status: "pending",
                timestamp: new Date(),
                comment: "Order submitted by customer",
              },
            ],
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      // Clear cart in background
      CartService.clearCart(userId, data.guestSessionId).catch(() => {});

      // Send confirmation email
      EmailService.sendOrderConfirmation(order, data.customerEmail).catch(() => {});

      // Notify admin
      const formattedTotal = `Rs. ${(totalAmount / 100).toLocaleString("en-LK", {
        minimumFractionDigits: 2,
      })}`;
      NotificationService.notifyNewOrder(orderNumber, formattedTotal).catch(() => {});

      return order;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  static async uploadBankSlip(orderId: string, receiptUrl: string, bankName?: string) {
    const order = await Order.findById(orderId);
    if (!order) throw ApiError.notFound("Order not found");

    order.bankTransferDetails = {
      receiptUrl,
      bankName: bankName || order.bankTransferDetails?.bankName,
      uploadedAt: new Date(),
    };
    order.paymentStatus = "pending_verification";
    order.statusHistory.push({
      status: order.orderStatus,
      timestamp: new Date(),
      comment: "Customer uploaded bank transfer payment slip",
    });

    await order.save();
    return order;
  }

  static async trackOrder(orderNumber: string, identifier: string) {
    const cleanNum = orderNumber.trim();
    const cleanId = identifier.trim().toLowerCase();

    const order = await Order.findOne({
      orderNumber: cleanNum,
      $or: [
        { customerEmail: cleanId },
        { customerPhone: cleanId },
        { "shippingAddress.phone": cleanId },
      ],
    }).populate("items.product", "slug");

    if (!order) {
      throw ApiError.notFound("No order found matching the provided order number and contact detail");
    }

    return order;
  }

  static async getCustomerOrders(userId: string, query: any) {
    const { page, limit, skip } = getPagination(query, 10);
    const filter = { customer: userId };

    const [total, orders] = await Promise.all([
      Order.countDocuments(filter),
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    return {
      orders,
      meta: createPaginationMeta(total, page, limit),
    };
  }

  static async getById(id: string, userId?: string, isAdmin = false) {
    const order = await Order.findById(id).populate("customer", "name email phone");
    if (!order) throw ApiError.notFound("Order not found");

    if (!isAdmin && order.customer?.toString() !== userId) {
      throw ApiError.forbidden("Access denied to this order");
    }

    return order;
  }

  // Admin methods
  static async listAdminOrders(query: any) {
    const { page, limit, skip } = getPagination(query, 15);
    const filter: any = {};

    if (query.search) {
      filter.$or = [
        { orderNumber: { $regex: query.search.trim(), $options: "i" } },
        { customerEmail: { $regex: query.search.trim(), $options: "i" } },
        { customerPhone: { $regex: query.search.trim(), $options: "i" } },
        { "shippingAddress.fullName": { $regex: query.search.trim(), $options: "i" } },
      ];
    }

    if (query.orderStatus) filter.orderStatus = query.orderStatus;
    if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
    if (query.paymentMethod) filter.paymentMethod = query.paymentMethod;

    if (query.startDate && query.endDate) {
      filter.createdAt = {
        $gte: new Date(query.startDate),
        $lte: new Date(query.endDate),
      };
    }

    const [total, orders] = await Promise.all([
      Order.countDocuments(filter),
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    return {
      orders,
      meta: createPaginationMeta(total, page, limit),
    };
  }

  static async updateOrderStatus(
    orderId: string,
    newStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled",
    adminUserId: string,
    trackingNumber?: string,
    comment?: string
  ) {
    const order = await Order.findById(orderId);
    if (!order) throw ApiError.notFound("Order not found");

    const prevStatus = order.orderStatus;
    order.orderStatus = newStatus;

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    order.statusHistory.push({
      status: newStatus,
      timestamp: new Date(),
      updatedBy: adminUserId as any,
      comment: comment || `Status updated from ${prevStatus} to ${newStatus}`,
    });

    // If order is cancelled and was not already cancelled, RESTORE INVENTORY!
    if (newStatus === "cancelled" && prevStatus !== "cancelled") {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          const prevStock = product.stockQuantity;
          const newStock = prevStock + item.quantity;
          product.stockQuantity = newStock;
          product.salesCount = Math.max(0, (product.salesCount || 0) - item.quantity);
          await product.save();

          await InventoryMovement.create({
            product: product._id,
            productName: product.name,
            sku: product.sku,
            type: "order_cancel_restore",
            quantity: item.quantity,
            previousStock: prevStock,
            newStock,
            referenceOrder: order.orderNumber,
            reason: `Order #${order.orderNumber} cancelled`,
            performedBy: adminUserId,
          });
        }
      }
    }

    await order.save();
    return order;
  }

  static async verifyBankTransfer(
    orderId: string,
    isApproved: boolean,
    adminUserId: string,
    rejectionReason?: string
  ) {
    const order = await Order.findById(orderId);
    if (!order) throw ApiError.notFound("Order not found");

    if (isApproved) {
      order.paymentStatus = "paid";
      if (!order.bankTransferDetails) order.bankTransferDetails = {};
      order.bankTransferDetails.verifiedAt = new Date();
      order.bankTransferDetails.verifiedBy = adminUserId as any;
      order.statusHistory.push({
        status: order.orderStatus,
        timestamp: new Date(),
        updatedBy: adminUserId as any,
        comment: "Bank transfer payment verified and marked as PAID",
      });
    } else {
      order.paymentStatus = "failed";
      if (!order.bankTransferDetails) order.bankTransferDetails = {};
      order.bankTransferDetails.rejectionReason = rejectionReason || "Payment slip rejected by admin";
      order.statusHistory.push({
        status: order.orderStatus,
        timestamp: new Date(),
        updatedBy: adminUserId as any,
        comment: `Bank transfer rejected: ${rejectionReason || "Verification failed"}`,
      });
    }

    await order.save();
    return order;
  }
}
