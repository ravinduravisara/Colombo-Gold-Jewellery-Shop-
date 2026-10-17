import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { UploadService } from "../../services/upload.service";
import { ApiError } from "../../utils/ApiError";

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await ProductService.getAll(req.query as any);
  res.status(200).json(ApiResponse.success(result.products, "Products retrieved", result.meta));
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const result = await ProductService.getBySlug(req.params.slug);
  res.status(200).json(ApiResponse.success(result, "Product details retrieved"));
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await ProductService.getById(req.params.id);
  res.status(200).json(ApiResponse.success(product, "Product retrieved"));
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await ProductService.create(req.body);
  res.status(201).json(ApiResponse.created(product, "Product created successfully"));
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await ProductService.update(req.params.id, req.body);
  res.status(200).json(ApiResponse.success(product, "Product updated successfully"));
});

export const archiveProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await ProductService.archive(req.params.id);
  res.status(200).json(ApiResponse.success(product, "Product archived successfully"));
});

export const restoreProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await ProductService.restore(req.params.id);
  res.status(200).json(ApiResponse.success(product, "Product restored successfully"));
});

export const deleteProductPermanent = asyncHandler(async (req: Request, res: Response) => {
  await ProductService.deletePermanent(req.params.id);
  res.status(200).json(ApiResponse.success(null, "Product permanently deleted"));
});

export const uploadProductImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw ApiError.badRequest("Please select an image file to upload");
  }

  const result = await UploadService.uploadFile(req.file, "products");
  res.status(200).json(
    ApiResponse.success(
      {
        url: result.url,
        publicId: result.publicId,
      },
      "Image uploaded successfully"
    )
  );
});

