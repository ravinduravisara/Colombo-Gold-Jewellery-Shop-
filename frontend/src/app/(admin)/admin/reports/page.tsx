"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  DollarSign,
  Package,
  TrendingUp,
  FileSpreadsheet,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { dashboardService } from "@/services/dashboardService";
import { formatLKR } from "@/lib/formatCurrency";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";

export default function AdminReportsPage() {
  const { showToast } = useUIStore();
  const [stats, setStats] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [overview, analytics] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getAnalyticsCharts(90),
        ]);
        setStats(overview);
        setCharts(analytics);
      } catch (err) {
        console.error("Failed to load reports data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleExportSales = async () => {
    try {
      showToast("Compiling sales report CSV...", "info");
      await dashboardService.downloadSalesReportCsv();
      showToast("Sales report downloaded successfully", "success");
    } catch {
      showToast("Failed to download sales report", "error");
    }
  };

  const handleExportInventory = async () => {
    try {
      showToast("Compiling inventory report CSV...", "info");
      await dashboardService.downloadInventoryReportCsv();
      showToast("Inventory report downloaded successfully", "success");
    } catch {
      showToast("Failed to download inventory report", "error");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Sales & Financial Reports</h2>
          <p className="text-xs text-zinc-400">
            Export comprehensive accounting statements and stock audit spreadsheets for business analysis
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            onClick={handleExportSales}
            className="flex items-center gap-1.5 text-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download Sales CSV</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportInventory}
            className="flex items-center gap-1.5 text-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download Stock CSV</span>
          </Button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
            Gross Revenue (All Time)
          </span>
          <p className="text-2xl font-serif font-bold text-white mt-2">
            {formatLKR(stats?.totalSales || 0)}
          </p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
            Current Month Revenue
          </span>
          <p className="text-2xl font-serif font-bold text-gold-400 mt-2">
            {formatLKR(stats?.monthlyRevenue || 0)}
          </p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
            Total Orders Completed
          </span>
          <p className="text-2xl font-serif font-bold text-white mt-2">
            {stats?.totalOrders || 0}
          </p>
        </div>
      </div>

      {/* 90-Day Trend Bar Chart */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-white">Daily Sales Trajectory</h3>
          <p className="text-xs text-zinc-400">Order revenue over the last 90 days</p>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts?.revenueTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="date"
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => val.slice(5)}
              />
              <YAxis
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `Rs.${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#09090b",
                  borderColor: "#3f3f46",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                }}
                formatter={(val: any) => [`Rs. ${Number(val).toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="revenueLkr" fill="#C6A667" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 5 Best Sellers Table */}
      {charts?.bestSellers && (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <h3 className="font-serif font-bold text-lg text-white">Top Performing Jewellery</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Item Name</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3 text-right">Units Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {charts.bestSellers.map((item: any) => (
                  <tr key={item._id} className="hover:bg-zinc-800/30">
                    <td className="py-3 px-3 font-semibold text-white">{item.name}</td>
                    <td className="py-3 px-3 font-mono text-zinc-400">{item.sku}</td>
                    <td className="py-3 px-3 font-serif text-gold-400">
                      {formatLKR(item.regularPrice)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-white">
                      {item.salesCount || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

