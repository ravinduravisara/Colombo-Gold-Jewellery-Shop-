import { Order } from "../orders/order.model";
import { Product } from "../products/product.model";
import { User } from "../users/user.model";
import { Category } from "../categories/category.model";

export class DashboardService {
  static async getOverviewStats() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      pendingOrders,
      totalCustomers,
      totalProducts,
      lowStockCount,
      allPaidOrders,
      todayPaidOrders,
      monthPaidOrders,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: "pending" }),
      User.countDocuments({ role: "customer" }),
      Product.countDocuments({ isArchived: false }),
      Product.countDocuments({
        isArchived: false,
        $expr: { $lte: ["$stockQuantity", "$lowStockThreshold"] },
      }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid", createdAt: { $gte: todayStart } } },
        { $group: { _id: null, todayRevenue: { $sum: "$totalAmount" } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: "paid", createdAt: { $gte: monthStart } } },
        { $group: { _id: null, monthRevenue: { $sum: "$totalAmount" } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(6).lean(),
    ]);

    const totalSales = allPaidOrders[0]?.totalSales || 0;
    const todayRevenue = todayPaidOrders[0]?.todayRevenue || 0;
    const monthlyRevenue = monthPaidOrders[0]?.monthRevenue || 0;

    return {
      totalSales, // LKR minor units
      todayRevenue, // LKR minor units
      monthlyRevenue, // LKR minor units
      totalOrders,
      pendingOrders,
      totalCustomers,
      totalProducts,
      lowStockCount,
      recentOrders,
    };
  }

  static async getAnalyticsCharts(days = 30) {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    // 1. Revenue & orders trend by day
    const trendData = await Order.aggregate([
      { $match: { createdAt: { $gte: sinceDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalAmount", 0],
            },
          },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format revenue to LKR main units for easier charts
    const revenueTrend = trendData.map((d) => ({
      date: d._id,
      revenueLkr: Math.round(d.revenue / 100),
      orders: d.orders,
    }));

    // 2. Order status breakdown
    const statusAgg = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusBreakdown = statusAgg.map((s) => ({
      status: s._id,
      count: s.count,
    }));

    // 3. Top selling products
    const bestSellers = await Product.find({ isArchived: false })
      .sort({ salesCount: -1 })
      .limit(5)
      .select("name sku regularPrice salesCount images")
      .lean();

    // 4. Monthly sales (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%b %Y", date: "$createdAt" } },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalAmount", 0],
            },
          },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      revenueTrend,
      statusBreakdown,
      bestSellers,
      monthlySales: monthlyData.map((m) => ({
        month: m._id,
        revenueLkr: Math.round(m.revenue / 100),
        orders: m.orders,
      })),
    };
  }

  static async generateSalesReportCsv(startDate?: string, endDate?: string) {
    const filter: any = {};
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();

    let csv = "Order Number,Date,Customer Name,Email,Phone,Payment Method,Payment Status,Order Status,Total (LKR)\n";
    for (const o of orders) {
      const dateStr = new Date(o.createdAt).toISOString().split("T")[0];
      const total = (o.totalAmount / 100).toFixed(2);
      csv += `"${o.orderNumber}","${dateStr}","${o.shippingAddress.fullName}","${o.customerEmail}","${o.customerPhone}","${o.paymentMethod}","${o.paymentStatus}","${o.orderStatus}",${total}\n`;
    }

    return csv;
  }

  static async generateInventoryReportCsv() {
    const products = await Product.find({ isArchived: false }).sort({ stockQuantity: 1 }).lean();

    let csv = "Product Name,SKU,Price (LKR),Stock Quantity,Threshold,Status\n";
    for (const p of products) {
      const price = (p.regularPrice / 100).toFixed(2);
      let status = "In Stock";
      if (p.stockQuantity <= 0) status = "Out of Stock";
      else if (p.stockQuantity <= p.lowStockThreshold) status = "Low Stock";

      csv += `"${p.name.replace(/"/g, '""')}","${p.sku}",${price},${p.stockQuantity},${p.lowStockThreshold},"${status}"\n`;
    }

    return csv;
  }
}

