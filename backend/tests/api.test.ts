import { Request, Response } from "express";
import { authenticate } from "../src/middleware/auth.middleware";
import { requireAdmin, requireSuperAdmin } from "../src/middleware/admin.middleware";
import { errorHandler } from "../src/middleware/error.middleware";
import { registerSchema, loginSchema } from "../src/modules/auth/auth.validation";
import { generateAccessToken } from "../src/utils/generateToken";

describe("Middleware & Validation Integration Tests", () => {
  describe("Auth Middleware", () => {
    it("should allow request with valid Bearer token", () => {
      const token = generateAccessToken({
        userId: "507f1f77bcf86cd799439011",
        email: "user@example.com",
        role: "customer",
      });

      const req: Partial<Request> = {
        headers: { authorization: `Bearer ${token}` },
        cookies: {},
      };
      const res: Partial<Response> = {};
      const next = jest.fn();

      authenticate(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith();
      expect((req as any).user).toBeDefined();
      expect((req as any).user.email).toBe("user@example.com");
    });

    it("should reject request with missing token", () => {
      const req: Partial<Request> = { headers: {}, cookies: {} };
      const res: Partial<Response> = {};
      const next = jest.fn();

      authenticate(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(401);
    });
  });

  describe("Admin Middleware", () => {
    it("should allow admin or superadmin", () => {
      const req: Partial<Request> = {
        user: { userId: "1", email: "admin@test.lk", role: "admin" },
      };
      const next = jest.fn();

      requireAdmin(req as Request, {} as Response, next);
      expect(next).toHaveBeenCalledWith();
    });

    it("should reject customer from admin endpoints with 403 Forbidden", () => {
      const req: Partial<Request> = {
        user: { userId: "2", email: "cust@test.lk", role: "customer" },
      };
      const next = jest.fn();

      requireAdmin(req as Request, {} as Response, next);
      const err = next.mock.calls[0][0];
      expect(err.statusCode).toBe(403);
    });

    it("should enforce superadmin only on sensitive endpoints", () => {
      const reqAdmin: Partial<Request> = {
        user: { userId: "1", email: "admin@test.lk", role: "admin" },
      };
      const next1 = jest.fn();
      requireSuperAdmin(reqAdmin as Request, {} as Response, next1);
      expect(next1.mock.calls[0][0].statusCode).toBe(403);

      const reqSuper: Partial<Request> = {
        user: { userId: "0", email: "super@test.lk", role: "superadmin" },
      };
      const next2 = jest.fn();
      requireSuperAdmin(reqSuper as Request, {} as Response, next2);
      expect(next2).toHaveBeenCalledWith();
    });
  });

  describe("Zod Schema Validations", () => {
    it("should validate correct registration payload", () => {
      const valid = {
        name: "Nimali Silva",
        email: "nimali@example.com",
        password: "SecurePassword123!",
        phone: "+94771234567",
      };
      expect(() => registerSchema.parse(valid)).not.toThrow();
    });

    it("should reject invalid registration emails", () => {
      const invalid = {
        name: "Nimali",
        email: "invalid-email",
        password: "123",
      };
      expect(() => registerSchema.parse(invalid)).toThrow();
    });

    it("should validate login credentials", () => {
      expect(() =>
        loginSchema.parse({ email: "user@test.lk", password: "password123" })
      ).not.toThrow();
      expect(() => loginSchema.parse({ email: "bad-email", password: "" })).toThrow();
    });
  });

  describe("Global Error Handler", () => {
    it("should format Mongoose duplicate key error (11000) into clean 409 Conflict", () => {
      const mongoDupError = {
        code: 11000,
        keyValue: { sku: "CGC-NK-101" },
      };

      const req: Partial<Request> = { method: "POST", originalUrl: "/api/v1/products" };
      let responseStatus = 0;
      let responseJson: any = null;

      const res: Partial<Response> = {
        status: (code: number) => {
          responseStatus = code;
          return res as Response;
        },
        json: (data: any) => {
          responseJson = data;
          return res as Response;
        },
      };

      errorHandler(mongoDupError, req as Request, res as Response, jest.fn());
      expect(responseStatus).toBe(409);
      expect(responseJson.success).toBe(false);
      expect(responseJson.message).toContain("Duplicate value entered for sku");
    });
  });
});

