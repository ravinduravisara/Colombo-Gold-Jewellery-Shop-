import { Router } from "express";
import * as EnquiryController from "./enquiry.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/admin.middleware";

const router = Router();

router.post("/", EnquiryController.submitEnquiry);
router.get("/admin/all", authenticate, requireAdmin, EnquiryController.listAdminEnquiries);
router.patch("/admin/:id/respond", authenticate, requireAdmin, EnquiryController.respondEnquiry);

export default router;

