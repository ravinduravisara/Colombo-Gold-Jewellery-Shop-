import { Router } from "express";
import * as ShippingController from "./shipping.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";

const router = Router();

router.get("/", ShippingController.getShippingZones);
router.post("/admin", authenticate, requireAdmin, ShippingController.createShippingZone);
router.patch("/admin/:id", authenticate, requireAdmin, ShippingController.updateShippingZone);
router.delete("/admin/:id", authenticate, requireAdmin, ShippingController.deleteShippingZone);

export default router;

