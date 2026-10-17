import { Router } from "express";
import * as CategoryController from "./category.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";

const router = Router();

router.get("/", CategoryController.getCategories);
router.get("/:slug", CategoryController.getCategoryBySlug);
router.post("/", authenticate, requireAdmin, CategoryController.createCategory);
router.patch("/:id", authenticate, requireAdmin, CategoryController.updateCategory);
router.delete("/:id", authenticate, requireAdmin, CategoryController.deleteCategory);

export default router;

