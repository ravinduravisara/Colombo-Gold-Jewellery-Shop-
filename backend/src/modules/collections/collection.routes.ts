import { Router } from "express";
import * as CollectionController from "./collection.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";

const router = Router();

router.get("/", CollectionController.getCollections);
router.get("/:slug", CollectionController.getCollectionBySlug);
router.post("/", authenticate, requireAdmin, CollectionController.createCollection);
router.patch("/:id", authenticate, requireAdmin, CollectionController.updateCollection);
router.delete("/:id", authenticate, requireAdmin, CollectionController.deleteCollection);

export default router;

