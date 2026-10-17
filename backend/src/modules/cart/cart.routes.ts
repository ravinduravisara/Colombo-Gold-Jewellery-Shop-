import { Router } from "express";
import * as CartController from "./cart.controller";
import { optionalAuthenticate, authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.use(optionalAuthenticate);

router.get("/", CartController.getCart);
router.post("/items", CartController.addItem);
router.patch("/items/:id", CartController.updateQuantity);
router.delete("/items/:id", CartController.removeItem);
router.delete("/", CartController.clearCart);
router.post("/merge", authenticate, CartController.mergeGuestCart);

export default router;

