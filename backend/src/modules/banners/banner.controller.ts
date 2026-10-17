import { Request, Response } from "express";
import { BannerService } from "./banner.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { UploadService } from "../../services/upload.service";
import { ApiError } from "../../utils/ApiError";

export const getBanners = asyncHandler(async (req: Request, res: Response) => {
  const banners = await BannerService.getActive(req.query.position as string);
  res.status(200).json(ApiResponse.success(banners, "Banners retrieved"));
});

export const listAdminBanners = asyncHandler(async (req: Request, res: Response) => {
  const banners = await BannerService.listAdminAll();
  res.status(200).json(ApiResponse.success(banners, "All banners retrieved"));
});

export const createBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await BannerService.create(req.body);
  res.status(201).json(ApiResponse.created(banner, "Banner created successfully"));
});

export const updateBanner = asyncHandler(async (req: Request, res: Response) => {
  const banner = await BannerService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(banner, "Banner updated successfully"));
});

export const deleteBanner = asyncHandler(async (req: Request, res: Response) => {
  await BannerService.delete(req.params.id);
  res.status(200).json(ApiResponse.success(null, "Banner deleted successfully"));
});

export const uploadBannerImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest("Please select a banner image");
  const result = await UploadService.uploadFile(req.file, "banners");
  res.status(200).json(ApiResponse.success(result, "Banner image uploaded successfully"));
});

