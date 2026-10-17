import { CorsOptions } from "cors";
import { ENV } from "./env";

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, curl, or same-origin)
    if (!origin) return callback(null, true);

    const configuredOrigins = ENV.CORS_ORIGIN
      ? ENV.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean)
      : [];

    const allowedOrigins = [
      ...configuredOrigins,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5001",
    ];

    const isVercelDomain = origin.endsWith(".vercel.app");

    if (
      allowedOrigins.includes(origin) ||
      isVercelDomain ||
      ENV.NODE_ENV !== "production"
    ) {
      return callback(null, true);
    } else {
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "x-guest-session-id",
    "X-Guest-Session-Id",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
  ],
  exposedHeaders: ["Set-Cookie"],
};

