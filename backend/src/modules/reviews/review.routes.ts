import { Router } from "express";
import * as ReviewController from "./review.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";

const router = Router();

// Public
router.get("/product/:productId", ReviewController.getProductReviews);

// Customer
router.post("/", authenticate, ReviewController.submitReview);

// Admin
router.get("/admin/all", authenticate, requireAdmin, ReviewController.listAdminReviews);
router.patch("/admin/:id/status", authenticate, requireAdmin, ReviewController.updateReviewStatus);

export default router;

