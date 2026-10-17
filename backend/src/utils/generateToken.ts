import jwt, { SignOptions } from "jsonwebtoken";
import { Response } from "express";
import crypto from "crypto";
import { ENV } from "../config/env";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "superadmin" | "admin" | "staff" | "customer";
}

export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: (ENV.JWT_EXPIRES_IN as any) || "1d",
  };
  return jwt.sign(payload, ENV.JWT_SECRET, options);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: (ENV.JWT_REFRESH_EXPIRES_IN as any) || "7d",
  };
  return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, options);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as TokenPayload;
};

export const generateResetToken = (): { token: string; hashedToken: string; expiresAt: Date } => {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return { token, hashedToken, expiresAt };
};

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken?: string
) => {
  const isProd = ENV.NODE_ENV === "production";
  
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: "/",
  });

  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });
  }
};

export const clearAuthCookies = (res: Response) => {
  const isProd = ENV.NODE_ENV === "production";
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
};

