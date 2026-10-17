import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const authorizeRoles = (...roles: Array<"superadmin" | "admin" | "staff" | "customer">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `User role '${req.user.role}' is not authorized to access this resource`
        )
      );
    }

    next();
  };
};

