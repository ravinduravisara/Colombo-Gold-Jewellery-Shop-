import { Router } from "express";
import * as OrderController from "./order.controller";
import { authenticate, optionalAuthenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";
import { upload } from "../../middleware/upload.middleware";

const router = Router();

// Customer / Guest endpoints
router.post("/", optionalAuthenticate, OrderController.createOrder);
router.post("/track", OrderController.trackOrder);
router.get("/my-orders", authenticate, OrderController.getCustomerOrders);
router.get("/:id", optionalAuthenticate, OrderController.getOrderById);
router.post("/:id/upload-receipt", upload.single("receipt"), OrderController.uploadBankReceipt);

// Admin endpoints
router.get("/admin/all", authenticate, requireAdmin, OrderController.listAdminOrders);
router.patch("/admin/:id/status", authenticate, requireAdmin, OrderController.updateOrderStatus);
router.patch("/admin/:id/verify-payment", authenticate, requireAdmin, OrderController.verifyBankTransfer);

export default router;

