import { Router } from "express";
import * as DashboardController from "./dashboard.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/stats", DashboardController.getDashboardStats);
router.get("/charts", DashboardController.getAnalyticsCharts);
router.get("/reports/sales-csv", DashboardController.exportSalesReportCsv);
router.get("/reports/inventory-csv", DashboardController.exportInventoryReportCsv);

export default router;

