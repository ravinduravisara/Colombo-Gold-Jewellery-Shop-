import { Request, Response } from "express";
import { ShippingService } from "./shipping.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";

export const getShippingZones = asyncHandler(async (req: Request, res: Response) => {
  const includeInactive = req.query.all === "true";
  const zones = await ShippingService.getAll(includeInactive);
  res.status(200).json(ApiResponse.success(zones, "Shipping zones retrieved"));
});

export const createShippingZone = asyncHandler(async (req: Request, res: Response) => {
  const zone = await ShippingService.create(req.body);
  res.status(201).json(ApiResponse.created(zone, "Shipping zone created successfully"));
});

export const updateShippingZone = asyncHandler(async (req: Request, res: Response) => {
  const zone = await ShippingService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(zone, "Shipping zone updated successfully"));
});

export const deleteShippingZone = asyncHandler(async (req: Request, res: Response) => {
  await ShippingService.delete(req.params.id);
  res.status(200).json(ApiResponse.success(null, "Shipping zone deleted successfully"));
});

