import { Request, Response } from "express";
import { InventoryService } from "./inventory.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";

export const getInventoryStatus = asyncHandler(async (req: Request, res: Response) => {
  const result = await InventoryService.getInventoryStatus(req.query);
  res.status(200).json(ApiResponse.success(result.inventory, "Inventory status retrieved", result.meta));
});

export const adjustStock = asyncHandler(async (req: Request, res: Response) => {
  const { productId, newQuantity, reason, variantId } = req.body;
  const result = await InventoryService.adjustStock(
    productId,
    Number(newQuantity),
    reason,
    req.user!.userId,
    variantId
  );
  res.status(200).json(ApiResponse.success(result, "Stock quantity adjusted successfully"));
});

export const getMovements = asyncHandler(async (req: Request, res: Response) => {
  const result = await InventoryService.getMovements(req.query);
  res.status(200).json(ApiResponse.success(result.movements, "Inventory movements retrieved", result.meta));
});

