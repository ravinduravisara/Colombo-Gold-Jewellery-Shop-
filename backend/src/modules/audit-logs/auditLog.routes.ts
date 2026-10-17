import { Router } from "express";
import * as AuditLogController from "./auditLog.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireSuperAdmin } from "../../middleware/admin.middleware";

const router = Router();

router.use(authenticate, requireSuperAdmin);

router.get("/", AuditLogController.getAuditLogs);

export default router;

