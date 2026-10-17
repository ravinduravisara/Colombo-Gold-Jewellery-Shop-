import { Request, Response } from "express";
import { WishlistService } from "./wishlist.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const products = await WishlistService.getWishlist(req.user!.userId);
  res.status(200).json(ApiResponse.success(products, "Wishlist retrieved"));
});

export const toggleProduct = asyncHandler(async (req: Request, res: Response) => {
  const result = await WishlistService.toggleProduct(req.user!.userId, req.params.productId);
  res.status(200).json(
    ApiResponse.success(
      result,
      result.isAdded ? "Added to wishlist" : "Removed from wishlist"
    )
  );
});

