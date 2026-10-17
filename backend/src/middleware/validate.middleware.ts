import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

export const validateRequest = (schema: ZodSchema, source: "body" | "query" | "params" = "body") => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const issues = error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return next(new ApiError(400, "Validation failed", issues));
      }
      return next(error);
    }
  };
};

