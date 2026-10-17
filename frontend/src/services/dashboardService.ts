import { api } from "./api";
import { ApiResponse } from "@/types/api";

export const dashboardService = {
  async getDashboardStats() {
    const res = await api.get<ApiResponse<any>>("/dashboard/stats");
    return res.data.data;
  },

  async getAnalyticsCharts(days = 30) {
    const res = await api.get<ApiResponse<any>>("/dashboard/charts", {
      params: { days },
    });
    return res.data.data;
  },

  async downloadSalesReportCsv() {
    const res = await api.get("/dashboard/reports/sales-csv", {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sales-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  async downloadInventoryReportCsv() {
    const res = await api.get("/dashboard/reports/inventory-csv", {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `inventory-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

