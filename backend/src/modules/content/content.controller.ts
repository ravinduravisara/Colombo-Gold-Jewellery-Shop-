import { Request, Response } from "express";
import { ContentService } from "./content.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";

export const getPage = asyncHandler(async (req: Request, res: Response) => {
  const page = await ContentService.getPageBySlug(req.params.slug);
  res.status(200).json(ApiResponse.success(page, "Page content retrieved"));
});

export const listAdminPages = asyncHandler(async (req: Request, res: Response) => {
  const pages = await ContentService.listAdminPages();
  res.status(200).json(ApiResponse.success(pages, "All pages retrieved"));
});

export const updatePage = asyncHandler(async (req: Request, res: Response) => {
  const page = await ContentService.updatePage(req.params.slug, req.body, req.user!.userId);
  res.status(200).json(ApiResponse.success(page, "Page updated successfully"));
});

