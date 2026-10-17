import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5001", 10),
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/colombo_gold_covering",
  
  JWT_SECRET: process.env.JWT_SECRET || "fallback_super_secret_jwt_key_colombo_gold_2026",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "fallback_refresh_key_colombo_gold_2026",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  COOKIE_SECRET: process.env.COOKIE_SECRET || "colombo_gold_secure_cookie_secret_key",
  
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
    API_KEY: process.env.CLOUDINARY_API_KEY || "",
    API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  },
  
  SMTP: {
    HOST: process.env.SMTP_HOST || "smtp.mailtrap.io",
    PORT: parseInt(process.env.SMTP_PORT || "2525", 10),
    USER: process.env.SMTP_USER || "",
    PASS: process.env.SMTP_PASS || "",
    FROM: process.env.EMAIL_FROM || '"Colombo Gold Covering" <noreply@colombogoldcovering.lk>',
  },
  
  INITIAL_SUPERADMIN: {
    NAME: process.env.INITIAL_SUPERADMIN_NAME || "Super Admin",
    EMAIL: process.env.INITIAL_SUPERADMIN_EMAIL || "admin@colombogoldcovering.lk",
    PASSWORD: process.env.INITIAL_SUPERADMIN_PASSWORD || "AdminSecureGold2026!",
    PHONE: process.env.INITIAL_SUPERADMIN_PHONE || "+94771234567",
  },
};

