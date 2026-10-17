import { Request, Response } from "express";
import { CouponService } from "./coupon.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";

export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  const result = await CouponService.validateCoupon(code, Number(subtotal));
  res.status(200).json(ApiResponse.success(result, "Coupon applied successfully"));
});

export const listAdminCoupons = asyncHandler(async (req: Request, res: Response) => {
  const coupons = await CouponService.listAdminCoupons();
  res.status(200).json(ApiResponse.success(coupons, "Coupons retrieved"));
});

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await CouponService.create(req.body);
  res.status(201).json(ApiResponse.created(coupon, "Coupon created successfully"));
});

export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await CouponService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(coupon, "Coupon updated successfully"));
});

export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  await CouponService.delete(req.params.id);
  res.status(200).json(ApiResponse.success(null, "Coupon deleted successfully"));
});

