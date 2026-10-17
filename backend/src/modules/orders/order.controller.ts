import { Request, Response } from "express";
import { OrderService } from "./order.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { UploadService } from "../../services/upload.service";
import { ApiError } from "../../utils/ApiError";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const guestSessionId = (req.headers["x-guest-session-id"] as string) || req.body.guestSessionId;
  const order = await OrderService.createOrder({ ...req.body, guestSessionId }, userId);
  res.status(201).json(ApiResponse.created(order, "Order placed successfully"));
});

export const getCustomerOrders = asyncHandler(async (req: Request, res: Response) => {
  const result = await OrderService.getCustomerOrders(req.user!.userId, req.query);
  res.status(200).json(ApiResponse.success(result.orders, "Orders retrieved", result.meta));
});

export const trackOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderNumber, identifier } = req.body;
  if (!orderNumber || !identifier) {
    throw ApiError.badRequest("Order number and contact email/phone are required");
  }
  const order = await OrderService.trackOrder(orderNumber, identifier);
  res.status(200).json(ApiResponse.success(order, "Order found"));
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const isAdmin = req.user?.role === "admin" || req.user?.role === "superadmin";
  const order = await OrderService.getById(req.params.id, req.user?.userId, isAdmin);
  res.status(200).json(ApiResponse.success(order, "Order details retrieved"));
});

export const uploadBankReceipt = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw ApiError.badRequest("Please select a bank receipt file (JPG, PNG, or PDF)");
  }

  const uploadResult = await UploadService.uploadFile(req.file, "receipts");
  const order = await OrderService.uploadBankSlip(
    req.params.id,
    uploadResult.url,
    req.body.bankName
  );

  res.status(200).json(
    ApiResponse.success(order, "Payment receipt uploaded. An administrator will verify your payment.")
  );
});

// Admin Controllers
export const listAdminOrders = asyncHandler(async (req: Request, res: Response) => {
  const result = await OrderService.listAdminOrders(req.query);
  res.status(200).json(ApiResponse.success(result.orders, "Orders retrieved", result.meta));
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status, trackingNumber, comment } = req.body;
  const order = await OrderService.updateOrderStatus(
    req.params.id,
    status,
    req.user!.userId,
    trackingNumber,
    comment
  );
  res.status(200).json(ApiResponse.success(order, `Order status updated to ${status}`));
});

export const verifyBankTransfer = asyncHandler(async (req: Request, res: Response) => {
  const { isApproved, rejectionReason } = req.body;
  const order = await OrderService.verifyBankTransfer(
    req.params.id,
    Boolean(isApproved),
    req.user!.userId,
    rejectionReason
  );
  res.status(200).json(
    ApiResponse.success(
      order,
      isApproved ? "Bank transfer approved and order marked as paid" : "Bank transfer rejected"
    )
  );
});

