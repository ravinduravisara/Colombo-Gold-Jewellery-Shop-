import { Request, Response } from "express";
import { SettingsService } from "./settings.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { UploadService } from "../../services/upload.service";
import { ApiError } from "../../utils/ApiError";

export const getPublicSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await SettingsService.getPublicSettings();
  res.status(200).json(ApiResponse.success(settings, "Public settings retrieved"));
});

export const getAdminSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await SettingsService.getSettings();
  res.status(200).json(ApiResponse.success(settings, "Full settings retrieved"));
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const updated = await SettingsService.updateSettings(req.body);
  res.status(200).json(ApiResponse.success(updated, "Website settings updated successfully"));
});

export const uploadLogo = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest("Please select a logo image");
  const uploadResult = await UploadService.uploadFile(req.file, "branding");
  const settings = await SettingsService.updateSettings({ logoUrl: uploadResult.url });
  res.status(200).json(ApiResponse.success(settings, "Logo updated successfully"));
});

