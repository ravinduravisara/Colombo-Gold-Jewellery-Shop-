import { Router } from "express";
import * as GalleryController from "./gallery.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";
import { upload } from "../../middleware/upload.middleware";

const router = Router();

router.get("/", GalleryController.getGallery);

// Admin
router.get("/admin/all", authenticate, requireAdmin, GalleryController.listAdminGallery);
router.post(
  "/admin/upload",
  authenticate,
  requireAdmin,
  upload.single("image"),
  GalleryController.uploadGalleryImage
);
router.post("/admin", authenticate, requireAdmin, GalleryController.createGalleryItem);
router.patch("/admin/:id", authenticate, requireAdmin, GalleryController.updateGalleryItem);
router.delete("/admin/:id", authenticate, requireAdmin, GalleryController.deleteGalleryItem);

export default router;

