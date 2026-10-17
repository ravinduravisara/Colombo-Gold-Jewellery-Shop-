import { Router } from "express";
import * as ProductController from "./product.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";
import { upload } from "../../middleware/upload.middleware";

const router = Router();

// Public routes
router.get("/", ProductController.getProducts);
router.get("/slug/:slug", ProductController.getProductBySlug);
router.get("/id/:id", ProductController.getProductById);

// Admin routes
router.post(
  "/upload",
  authenticate,
  requireAdmin,
  upload.single("image"),
  ProductController.uploadProductImage
);
router.post("/", authenticate, requireAdmin, ProductController.createProduct);
router.patch("/:id", authenticate, requireAdmin, ProductController.updateProduct);
router.patch("/:id/archive", authenticate, requireAdmin, ProductController.archiveProduct);
router.patch("/:id/restore", authenticate, requireAdmin, ProductController.restoreProduct);
router.delete("/:id", authenticate, requireAdmin, ProductController.deleteProductPermanent);

export default router;

