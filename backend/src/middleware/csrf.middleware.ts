import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ENV } from "../config/env";

export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Safe HTTP methods do not mutate state
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  // If request uses Bearer token, CSRF is not applicable as browser does not send it automatically
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    return next();
  }

  // If using cookies, ensure origin or referer matches our frontend
  const origin = req.headers.origin || req.headers.referer;
  if (!origin) {
    // In development mode, allow tool testing
    if (ENV.NODE_ENV !== "production") {
      return next();
    }
    return next(ApiError.forbidden("CSRF verification failed: Missing origin/referer header"));
  }

  const allowedOrigins = [
    ENV.CORS_ORIGIN,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];

  const originUrl = new URL(origin);
  const isAllowed = allowedOrigins.some((allowed) => {
    try {
      const allowedUrl = new URL(allowed);
      return allowedUrl.origin === originUrl.origin;
    } catch {
      return false;
    }
  });

  if (!isAllowed && ENV.NODE_ENV === "production") {
    return next(ApiError.forbidden("CSRF verification failed: Unauthorized origin"));
  }

  next();
};

