import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(ApiError.unauthorized("Authentication required"));
  }

  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    return next(ApiError.forbidden("Access denied: Administrative privileges required"));
  }

  next();
};

export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(ApiError.unauthorized("Authentication required"));
  }

  if (req.user.role !== "superadmin") {
    return next(ApiError.forbidden("Access denied: Super Administrator privileges required"));
  }

  next();
};

