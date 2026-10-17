import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ENV } from "../config/env";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ApiError(404, message);
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const message = `Duplicate value entered for ${field}: ${err.keyValue ? err.keyValue[field] : ""}`;
    error = new ApiError(409, message);
  }

  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val: any) => val.message)
      .join(", ");
    error = new ApiError(400, message);
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token. Please authenticate again.");
  }

  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Token expired. Please login again.");
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  if (statusCode >= 500) {
    logger.error(`[UnhandledError] ${req.method} ${req.originalUrl} - ${message}`, error.stack);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: error.errors || [],
    ...(ENV.NODE_ENV === "development" && { stack: error.stack }),
  });
};

