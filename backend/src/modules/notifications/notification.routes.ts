import { Router } from "express";
import * as NotificationController from "./notification.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/", NotificationController.getNotifications);
router.patch("/:id/read", NotificationController.markAsRead);
router.post("/read-all", NotificationController.markAllAsRead);

export default router;

