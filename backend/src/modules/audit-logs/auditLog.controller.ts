import { Request, Response } from "express";
import { AuditLog } from "./auditLog.model";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { getPagination, createPaginationMeta } from "../../utils/pagination";

export const getAuditLogs = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req.query, 20);
  const filter: any = {};
  if (req.query.module) filter.module = req.query.module;

  const [total, logs] = await Promise.all([
    AuditLog.countDocuments(filter),
    AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
  ]);

  res.status(200).json(ApiResponse.success(logs, "Audit logs retrieved", createPaginationMeta(total, page, limit)));
});

