"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  Download,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { dashboardService } from "@/services/dashboardService";
import { orderService } from "@/services/orderService";
import { formatLKR } from "@/lib/formatCurrency";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/uiStore";

export default function AdminDashboardPage() {
  const { showToast } = useUIStore();
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [daysFilter, setDaysFilter] = useState(30);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [overview, analytics] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getAnalyticsCharts(daysFilter),
        ]);
        setStats(overview);
        setRecentOrders(overview?.recentOrders || []);
        setChartData(analytics?.revenueTrend || []);
        setStatusData(analytics?.statusBreakdown || []);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [daysFilter]);

  const handleExportSales = async () => {
    try {
      showToast("Generating sales report CSV...", "info");
      await dashboardService.downloadSalesReportCsv();
      showToast("Sales report downloaded successfully", "success");
    } catch {
      showToast("Failed to download sales report", "error");
    }
  };

  const handleExportInventory = async () => {
    try {
      showToast("Generating inventory report CSV...", "info");
      await dashboardService.downloadInventoryReportCsv();
      showToast("Inventory report downloaded successfully", "success");
    } catch {
      showToast("Failed to download inventory report", "error");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(orderId, { status: newStatus });
      setRecentOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      showToast(`Order status updated to ${newStatus}`, "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to update order status", "error");
    }
  };

  if (isLoading && !stats) {
    return (
      <div className="py-20 text-center text-gold-400">
        <div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs uppercase tracking-widest text-zinc-400">
          Loading Dashboard Analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
            Executive Summary
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time business performance across Sri Lanka storefront and WhatsApp channels
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportSales}
            className="text-xs border-zinc-700 hover:border-gold-500/50"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Sales CSV</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportInventory}
            className="text-xs border-zinc-700 hover:border-gold-500/50"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Stock CSV</span>
          </Button>

          <Link href="/admin/products/new">
            <Button size="sm" className="text-xs flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Add Jewellery</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden group hover:border-gold-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              Total Revenue
            </span>
            <div className="p-2.5 rounded-xl bg-gold-500/10 text-gold-400 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-white mt-3">
            {formatLKR(stats?.totalSales || 0)}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-gold-400/90 mt-1 font-medium">
            <span>This Month: {formatLKR(stats?.monthlyRevenue || 0)}</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden group hover:border-gold-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              Customer Orders
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-white mt-3">
            {stats?.totalOrders || 0}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-amber-400 mt-1 font-medium">
            <span>{stats?.pendingOrders || 0} pending processing</span>
          </div>
        </div>

        {/* Registered Customers */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden group hover:border-gold-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              Active Customers
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-white mt-3">
            {stats?.totalCustomers || 0}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-1">
            <span>Registered accounts</span>
          </div>
        </div>

        {/* Inventory Status / Alerts */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              Low Stock Alerts
            </span>
            <div
              className={`p-2.5 rounded-xl ${
                stats?.lowStockCount > 0
                  ? "bg-red-500/10 text-red-400"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-white mt-3">
            {stats?.lowStockCount || 0}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-1">
            <Link
              href="/admin/inventory"
              className="hover:text-gold-400 underline underline-offset-2"
            >
              Manage stock alerts
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-white">Revenue Overview</h3>
              <p className="text-xs text-zinc-400">
                Daily sales trajectory in Sri Lankan Rupees (LKR)
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
              <button
                onClick={() => setDaysFilter(7)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  daysFilter === 7 ? "bg-gold-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                7D
              </button>
              <button
                onClick={() => setDaysFilter(30)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  daysFilter === 30 ? "bg-gold-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                30D
              </button>
              <button
                onClick={() => setDaysFilter(90)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  daysFilter === 90 ? "bg-gold-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                90D
              </button>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C6A667" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C6A667" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="revenueLkr"
                  stroke="#C6A667"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#goldGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-white">Order Pipeline</h3>
            <p className="text-xs text-zinc-400">Distribution of customer orders</p>
          </div>

          <div className="space-y-3.5 my-auto">
            {statusData.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-8">No order status data available</p>
            ) : (
              statusData.map((item) => {
                const total = statusData.reduce((acc, curr) => acc + curr.count, 0) || 1;
                const percentage = Math.round((item.count / total) * 100);

                return (
                  <div key={item.status} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize font-medium text-zinc-300">
                        {item.status}
                      </span>
                      <span className="text-gold-400 font-semibold">
                        {item.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold-500 to-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-4 border-t border-zinc-800/80">
            <Link href="/admin/orders">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Manage All Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Section with Status Changer */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-white">Recent Customer Orders</h3>
            <p className="text-xs text-zinc-400">
              Direct order updates, customer contacts & bank slips
            </p>
          </div>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="text-gold-400 hover:text-gold-300 text-xs">
              View All Orders →
            </Button>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 text-xs">No orders recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Order #</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Fulfillment Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-white">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-medium text-zinc-200">
                        {order.shippingAddress?.fullName || "Guest"}
                      </p>
                      <p className="text-[11px] text-zinc-400">{order.shippingAddress?.phone}</p>
                    </td>
                    <td className="py-3.5 px-3 font-serif font-bold text-gold-400">
                      {formatLKR(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full capitalize text-[10px] font-semibold ${
                            order.paymentStatus === "paid"
                              ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-950/60 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                        <span className="text-[10px] text-zinc-400 capitalize">
                          ({order.paymentMethod?.replace("_", " ")})
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="text-xs bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-gold-500 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link href={`/admin/orders?id=${order._id}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-gold-400">
                          Inspect
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

