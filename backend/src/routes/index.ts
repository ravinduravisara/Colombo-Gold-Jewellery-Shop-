import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/users/user.routes";
import productRoutes from "../modules/products/product.routes";
import categoryRoutes from "../modules/categories/category.routes";
import collectionRoutes from "../modules/collections/collection.routes";
import cartRoutes from "../modules/cart/cart.routes";
import wishlistRoutes from "../modules/wishlist/wishlist.routes";
import orderRoutes from "../modules/orders/order.routes";
import inventoryRoutes from "../modules/inventory/inventory.routes";
import reviewRoutes from "../modules/reviews/review.routes";
import couponRoutes from "../modules/coupons/coupon.routes";
import shippingRoutes from "../modules/shipping/shipping.routes";
import bannerRoutes from "../modules/banners/banner.routes";
import galleryRoutes from "../modules/gallery/gallery.routes";
import contentRoutes from "../modules/content/content.routes";
import enquiryRoutes from "../modules/enquiries/enquiry.routes";
import settingsRoutes from "../modules/settings/settings.routes";
import dashboardRoutes from "../modules/dashboard/dashboard.routes";
import notificationRoutes from "../modules/notifications/notification.routes";
import auditLogRoutes from "../modules/audit-logs/auditLog.routes";

const router = Router();

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Colombo Gold Covering API",
    version: "1.0.0",
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/collections", collectionRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/orders", orderRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/reviews", reviewRoutes);
router.use("/coupons", couponRoutes);
router.use("/shipping", shippingRoutes);
router.use("/banners", bannerRoutes);
router.use("/gallery", galleryRoutes);
router.use("/content", contentRoutes);
router.use("/enquiries", enquiryRoutes);
router.use("/settings", settingsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/notifications", notificationRoutes);
router.use("/audit-logs", auditLogRoutes);

export default router;

