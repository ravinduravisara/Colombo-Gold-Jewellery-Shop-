import { Request, Response } from "express";
import { GalleryService } from "./gallery.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { UploadService } from "../../services/upload.service";
import { ApiError } from "../../utils/ApiError";

export const getGallery = asyncHandler(async (req: Request, res: Response) => {
  const items = await GalleryService.getActive(req.query.type as string);
  res.status(200).json(ApiResponse.success(items, "Gallery media retrieved"));
});

export const listAdminGallery = asyncHandler(async (req: Request, res: Response) => {
  const items = await GalleryService.listAdminAll();
  res.status(200).json(ApiResponse.success(items, "All gallery items retrieved"));
});

export const createGalleryItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await GalleryService.create(req.body);
  res.status(201).json(ApiResponse.created(item, "Gallery item created successfully"));
});

export const updateGalleryItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await GalleryService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(item, "Gallery item updated successfully"));
});

export const deleteGalleryItem = asyncHandler(async (req: Request, res: Response) => {
  await GalleryService.delete(req.params.id);
  res.status(200).json(ApiResponse.success(null, "Gallery item deleted successfully"));
});

export const uploadGalleryImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest("Please select an image file");
  const result = await UploadService.uploadFile(req.file, "gallery");
  res.status(200).json(ApiResponse.success(result, "Gallery media uploaded successfully"));
});

