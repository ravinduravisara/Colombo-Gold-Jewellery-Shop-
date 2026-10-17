import { Router } from "express";
import * as WishlistController from "./wishlist.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", WishlistController.getWishlist);
router.post("/toggle/:productId", WishlistController.toggleProduct);

export default router;

