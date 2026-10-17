import { Router } from "express";
import * as InventoryController from "./inventory.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/status", InventoryController.getInventoryStatus);
router.post("/adjust", InventoryController.adjustStock);
router.get("/movements", InventoryController.getMovements);

export default router;

