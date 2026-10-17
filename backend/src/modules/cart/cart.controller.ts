import { Request, Response } from "express";
import { CartService } from "./cart.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";

const getIdentifiers = (req: Request) => {
  const userId = req.user?.userId;
  const guestSessionId = (req.headers["x-guest-session-id"] as string) || (req.query.sessionId as string);
  return { userId, guestSessionId };
};

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const { userId, guestSessionId } = getIdentifiers(req);
  const cart = await CartService.getCart(userId, guestSessionId);
  res.status(200).json(ApiResponse.success(cart, "Cart retrieved"));
});

export const addItem = asyncHandler(async (req: Request, res: Response) => {
  const { userId, guestSessionId } = getIdentifiers(req);
  const cart = await CartService.addItem(req.body, userId, guestSessionId);
  res.status(200).json(ApiResponse.success(cart, "Item added to cart"));
});

export const updateQuantity = asyncHandler(async (req: Request, res: Response) => {
  const { userId, guestSessionId } = getIdentifiers(req);
  const cart = await CartService.updateQuantity(req.params.id, req.body.quantity, userId, guestSessionId);
  res.status(200).json(ApiResponse.success(cart, "Cart updated"));
});

export const removeItem = asyncHandler(async (req: Request, res: Response) => {
  const { userId, guestSessionId } = getIdentifiers(req);
  const cart = await CartService.removeItem(req.params.id, userId, guestSessionId);
  res.status(200).json(ApiResponse.success(cart, "Item removed from cart"));
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const { userId, guestSessionId } = getIdentifiers(req);
  const cart = await CartService.clearCart(userId, guestSessionId);
  res.status(200).json(ApiResponse.success(cart, "Cart cleared"));
});

export const mergeGuestCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { guestSessionId } = req.body;
  await CartService.mergeGuestCart(userId, guestSessionId);
  const cart = await CartService.getCart(userId);
  res.status(200).json(ApiResponse.success(cart, "Guest cart merged successfully"));
});

