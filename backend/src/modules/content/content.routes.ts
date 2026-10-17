import { Router } from "express";
import * as ContentController from "./content.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";

const router = Router();

router.get("/:slug", ContentController.getPage);
router.get("/admin/all", authenticate, requireAdmin, ContentController.listAdminPages);
router.patch("/admin/:slug", authenticate, requireAdmin, ContentController.updatePage);

export default router;

