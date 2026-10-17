import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { corsOptions } from "./config/cors";
import { ENV } from "./config/env";
import { apiLimiter } from "./middleware/rateLimit.middleware";
import { errorHandler } from "./middleware/error.middleware";
import { ApiError } from "./utils/ApiError";
import apiRoutes from "./routes";

const app: Application = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Logging
if (ENV.NODE_ENV !== "test") {
  app.use(morgan(ENV.NODE_ENV === "development" ? "dev" : "combined"));
}

// CORS & Cookie parsing
app.use(cors(corsOptions));
app.use(cookieParser(ENV.COOKIE_SECRET));

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static file serving for uploads (receipts, product images)
const uploadsPath = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

// Apply general rate limiter
app.use("/api/v1", apiLimiter);

// API v1 Routes
app.use("/api/v1", apiRoutes);

// Root greeting
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Colombo Gold Covering API Server is running",
    docs: "/api/v1/health",
  });
});

// Handle 404
app.use((req: Request, res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Cannot ${req.method} ${req.originalUrl}`));
});

// Global error handler
app.use(errorHandler);

export default app;

