import { Router } from "express";
import * as AuthController from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { authLimiter } from "../../middleware/rateLimit.middleware";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation";

const router = Router();

router.post("/register", authLimiter, validateRequest(registerSchema), AuthController.register);
router.post("/login", authLimiter, validateRequest(loginSchema), AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.post(
  "/forgot-password",
  authLimiter,
  validateRequest(forgotPasswordSchema),
  AuthController.forgotPassword
);
router.post(
  "/reset-password",
  authLimiter,
  validateRequest(resetPasswordSchema),
  AuthController.resetPassword
);
router.get("/me", authenticate, AuthController.getMe);

export default router;

