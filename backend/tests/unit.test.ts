import { generateAccessToken, verifyAccessToken, generateResetToken } from "../src/utils/generateToken";
import { generateOrderNumber } from "../src/utils/generateOrderNumber";
import { generateSlug } from "../src/utils/slugify";
import { ApiError } from "../src/utils/ApiError";
import { ApiResponse } from "../src/utils/ApiResponse";
import { getPagination, createPaginationMeta } from "../src/utils/pagination";

describe("Colombo Gold Covering Unit Tests", () => {
  describe("Security & Tokens", () => {
    it("should issue and decode valid customer JWT tokens", () => {
      const payload = {
        userId: "64f1a2b3c4d5e6f7a8b9c0d1",
        email: "dilshan@example.lk",
        role: "customer" as const,
      };

      const token = generateAccessToken(payload);
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);

      const verified = verifyAccessToken(token);
      expect(verified.userId).toBe(payload.userId);
      expect(verified.email).toBe(payload.email);
      expect(verified.role).toBe("customer");
    });

    it("should issue and decode valid admin JWT tokens", () => {
      const payload = {
        userId: "64f1a2b3c4d5e6f7a8b9c0d2",
        email: "admin@colombogoldcovering.lk",
        role: "superadmin" as const,
      };

      const token = generateAccessToken(payload);
      const verified = verifyAccessToken(token);
      expect(verified.role).toBe("superadmin");
    });

    it("should generate random secure password reset tokens with SHA-256 hash", () => {
      const { token, hashedToken, expiresAt } = generateResetToken();
      expect(token).toBeDefined();
      expect(token.length).toBe(64);
      expect(hashedToken).toBeDefined();
      expect(expiresAt.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe("Order Number & Slug Generator", () => {
    it("should create Sri Lankan formatted order numbers matching CGC-YYYYMM-XXXX", () => {
      const num1 = generateOrderNumber();
      const num2 = generateOrderNumber();
      expect(num1).toMatch(/^CGC-\d{6}-\d{4}$/);
      expect(num2).toMatch(/^CGC-\d{6}-\d{4}$/);
      expect(num1).not.toBe(num2);
    });

    it("should format clean, SEO-friendly slugs for jewellery items", () => {
      expect(generateSlug("24K Gold Plated Peacock Choker")).toBe("24k-gold-plated-peacock-choker");
      expect(generateSlug("Jimikki Earrings (Pair) - 22K Micro Gold")).toBe("jimikki-earrings-pair-22k-micro-gold");
      expect(generateSlug("Kada Bangles - 2.6 Size")).toBe("kada-bangles-26-size");
    });
  });

  describe("API Error & Response Formatter", () => {
    it("should create badRequest ApiError with 400 status", () => {
      const err = ApiError.badRequest("Invalid delivery district");
      expect(err.statusCode).toBe(400);
      expect(err.message).toBe("Invalid delivery district");
    });

    it("should create unauthorized ApiError with 401 status", () => {
      const err = ApiError.unauthorized();
      expect(err.statusCode).toBe(401);
    });

    it("should format consistent ApiResponse structures", () => {
      const res = ApiResponse.success({ id: 1 }, "Item found", { total: 1 });
      expect(res.success).toBe(true);
      expect(res.statusCode).toBe(200);
      expect(res.data).toEqual({ id: 1 });
      expect(res.meta?.total).toBe(1);

      const created = ApiResponse.created({ id: 2 }, "Order created");
      expect(created.statusCode).toBe(201);
      expect(created.success).toBe(true);
    });
  });

  describe("Pagination Calculations", () => {
    it("should calculate correct skip and limit offsets", () => {
      const p1 = getPagination({ page: "1", limit: "12" });
      expect(p1.page).toBe(1);
      expect(p1.limit).toBe(12);
      expect(p1.skip).toBe(0);

      const p2 = getPagination({ page: "3", limit: "10" });
      expect(p2.page).toBe(3);
      expect(p2.limit).toBe(10);
      expect(p2.skip).toBe(20);
    });

    it("should generate pagination metadata with next/prev flags", () => {
      const meta = createPaginationMeta(55, 2, 10);
      expect(meta.total).toBe(55);
      expect(meta.totalPages).toBe(6);
      expect(meta.hasNextPage).toBe(true);
      expect(meta.hasPrevPage).toBe(true);
    });
  });
});
