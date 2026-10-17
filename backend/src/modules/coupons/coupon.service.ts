import { Coupon, ICoupon } from "./coupon.model";
import { ApiError } from "../../utils/ApiError";

export class CouponService {
  static async validateCoupon(code: string, subtotalAmount: number) {
    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
      expiryDate: { $gt: new Date() },
    });

    if (!coupon) {
      throw ApiError.badRequest("Invalid or expired coupon code");
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      throw ApiError.badRequest("Coupon usage limit has been reached");
    }

    if (subtotalAmount < coupon.minPurchaseAmount) {
      const minLkr = (coupon.minPurchaseAmount / 100).toLocaleString("en-LK");
      throw ApiError.badRequest(`Minimum purchase of Rs. ${minLkr} required for this coupon`);
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.round((subtotalAmount * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, subtotalAmount);

    return {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
    };
  }

  static async listAdminCoupons() {
    return Coupon.find().sort({ createdAt: -1 });
  }

  static async create(data: Partial<ICoupon>) {
    const code = data.code?.trim().toUpperCase();
    const existing = await Coupon.findOne({ code });
    if (existing) throw ApiError.conflict("A coupon with this code already exists");

    return Coupon.create({
      ...data,
      code,
    });
  }

  static async update(id: string, data: Partial<ICoupon>) {
    if (data.code) data.code = data.code.trim().toUpperCase();
    const coupon = await Coupon.findByIdAndUpdate(id, data, { new: true });
    if (!coupon) throw ApiError.notFound("Coupon not found");
    return coupon;
  }

  static async delete(id: string) {
    const deleted = await Coupon.findByIdAndDelete(id);
    if (!deleted) throw ApiError.notFound("Coupon not found");
    return deleted;
  }
}

