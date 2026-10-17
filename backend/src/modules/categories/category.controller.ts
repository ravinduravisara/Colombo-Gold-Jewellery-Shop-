import { Request, Response } from "express";
import { CategoryService } from "./category.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const includeInactive = req.query.all === "true";
  const categories = await CategoryService.getAll(includeInactive);
  res.status(200).json(ApiResponse.success(categories, "Categories retrieved successfully"));
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const category = await CategoryService.getBySlug(req.params.slug);
  res.status(200).json(ApiResponse.success(category, "Category retrieved"));
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await CategoryService.create(req.body);
  res.status(201).json(ApiResponse.created(category, "Category created successfully"));
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await CategoryService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(category, "Category updated successfully"));
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await CategoryService.delete(req.params.id);
  res.status(200).json(ApiResponse.success(null, "Category deleted successfully"));
});

