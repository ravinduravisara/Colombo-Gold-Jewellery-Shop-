import { Router } from "express";
import * as SettingsController from "./settings.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";
import { upload } from "../../middleware/upload.middleware";

const router = Router();

// Public
router.get("/public", SettingsController.getPublicSettings);

// Admin
router.get("/admin", authenticate, requireAdmin, SettingsController.getAdminSettings);
router.patch("/admin", authenticate, requireAdmin, SettingsController.updateSettings);
router.post(
  "/admin/logo",
  authenticate,
  requireAdmin,
  upload.single("logo"),
  SettingsController.uploadLogo
);

export default router;

