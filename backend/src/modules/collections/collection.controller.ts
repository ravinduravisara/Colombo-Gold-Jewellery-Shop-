import { Request, Response } from "express";
import { CollectionService } from "./collection.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";

export const getCollections = asyncHandler(async (req: Request, res: Response) => {
  const includeInactive = req.query.all === "true";
  const collections = await CollectionService.getAll(includeInactive);
  res.status(200).json(ApiResponse.success(collections, "Collections retrieved successfully"));
});

export const getCollectionBySlug = asyncHandler(async (req: Request, res: Response) => {
  const collection = await CollectionService.getBySlug(req.params.slug);
  res.status(200).json(ApiResponse.success(collection, "Collection retrieved"));
});

export const createCollection = asyncHandler(async (req: Request, res: Response) => {
  const collection = await CollectionService.create(req.body);
  res.status(201).json(ApiResponse.created(collection, "Collection created successfully"));
});

export const updateCollection = asyncHandler(async (req: Request, res: Response) => {
  const collection = await CollectionService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(collection, "Collection updated successfully"));
});

export const deleteCollection = asyncHandler(async (req: Request, res: Response) => {
  await CollectionService.delete(req.params.id);
  res.status(200).json(ApiResponse.success(null, "Collection deleted successfully"));
});

