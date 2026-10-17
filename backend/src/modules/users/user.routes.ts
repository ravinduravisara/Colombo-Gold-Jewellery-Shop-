import { Router } from "express";
import * as UserController from "./user.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin, requireSuperAdmin } from "../../middleware/admin.middleware";

const router = Router();

// Customer Profile & Addresses (Authenticated)
router.patch("/profile", authenticate, UserController.updateProfile);
router.post("/addresses", authenticate, UserController.addAddress);
router.patch("/addresses/:id", authenticate, UserController.updateAddress);
router.delete("/addresses/:id", authenticate, UserController.deleteAddress);

// Admin Routes
router.get("/admin/customers", authenticate, requireAdmin, UserController.listCustomers);
router.get("/admin/staff", authenticate, requireSuperAdmin, UserController.listAdminUsers);
router.post("/admin/staff", authenticate, requireSuperAdmin, UserController.createStaffUser);
router.patch("/admin/status/:id", authenticate, requireAdmin, UserController.toggleUserStatus);

export default router;

