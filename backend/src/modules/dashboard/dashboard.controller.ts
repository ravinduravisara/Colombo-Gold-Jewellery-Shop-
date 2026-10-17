import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await DashboardService.getOverviewStats();
  res.status(200).json(ApiResponse.success(stats, "Dashboard statistics retrieved"));
});

export const getAnalyticsCharts = asyncHandler(async (req: Request, res: Response) => {
  const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
  const charts = await DashboardService.getAnalyticsCharts(days);
  res.status(200).json(ApiResponse.success(charts, "Analytics charts retrieved"));
});

export const exportSalesReportCsv = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  const csv = await DashboardService.generateSalesReportCsv(
    startDate as string,
    endDate as string
  );

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=sales-report.csv");
  res.status(200).send(csv);
});

export const exportInventoryReportCsv = asyncHandler(async (req: Request, res: Response) => {
  const csv = await DashboardService.generateInventoryReportCsv();
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=inventory-report.csv");
  res.status(200).send(csv);
});

