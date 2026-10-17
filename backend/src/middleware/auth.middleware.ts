import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../utils/generateToken";
import { ApiError } from "../utils/ApiError";

// Augment Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // 1. Check HTTP-only cookie first
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  } 
  // 2. Fall back to Authorization Header Bearer token
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(ApiError.unauthorized("Authentication required. Please sign in."));
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Access token expired. Please refresh your session."));
    }
    return next(ApiError.unauthorized("Invalid access token."));
  }
};

export const optionalAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    } catch {
      // Continue as guest
    }
  }
  next();
};

