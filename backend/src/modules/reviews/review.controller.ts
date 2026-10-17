import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";

export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  const result = await ReviewService.getProductReviews(req.params.productId, req.query);
  res.status(200).json(ApiResponse.success(result.reviews, "Reviews retrieved", result.meta));
});

export const submitReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await ReviewService.submitReview(
    req.user!.userId,
    req.body.userName || "Customer",
    req.body
  );
  res.status(201).json(
    ApiResponse.created(
      review,
      "Review submitted successfully. It will appear on the store upon approval."
    )
  );
});

export const listAdminReviews = asyncHandler(async (req: Request, res: Response) => {
  const result = await ReviewService.listAdminReviews(req.query);
  res.status(200).json(ApiResponse.success(result.reviews, "Reviews retrieved", result.meta));
});

export const updateReviewStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status, adminFeedback } = req.body;
  const review = await ReviewService.updateReviewStatus(req.params.id, status, adminFeedback);
  res.status(200).json(ApiResponse.success(review, `Review ${status} successfully`));
});

