import { Router } from "express";
import * as CouponController from "./coupon.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";

const router = Router();

router.post("/validate", CouponController.validateCoupon);
router.get("/admin/all", authenticate, requireAdmin, CouponController.listAdminCoupons);
router.post("/admin", authenticate, requireAdmin, CouponController.createCoupon);
router.patch("/admin/:id", authenticate, requireAdmin, CouponController.updateCoupon);
router.delete("/admin/:id", authenticate, requireAdmin, CouponController.deleteCoupon);

export default router;

