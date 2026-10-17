import { Router } from "express";
import * as BannerController from "./banner.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";
import { upload } from "../../middleware/upload.middleware";

const router = Router();

router.get("/", BannerController.getBanners);

// Admin
router.get("/admin/all", authenticate, requireAdmin, BannerController.listAdminBanners);
router.post(
  "/admin/upload",
  authenticate,
  requireAdmin,
  upload.single("image"),
  BannerController.uploadBannerImage
);
router.post("/admin", authenticate, requireAdmin, BannerController.createBanner);
router.patch("/admin/:id", authenticate, requireAdmin, BannerController.updateBanner);
router.delete("/admin/:id", authenticate, requireAdmin, BannerController.deleteBanner);

export default router;

