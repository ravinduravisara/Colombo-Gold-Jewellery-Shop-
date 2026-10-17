import { Notification } from "../modules/notifications/notification.model";
import { logger } from "../utils/logger";

export class NotificationService {
  static async create(data: {
    title: string;
    message: string;
    type: "order" | "inventory" | "enquiry" | "review" | "system";
    link?: string;
  }) {
    try {
      const notification = await Notification.create(data);
      return notification;
    } catch (err) {
      logger.error("[Notification Service Error]", err);
      return null;
    }
  }

  static async notifyLowStock(productName: string, currentStock: number) {
    return this.create({
      title: "Low Stock Alert",
      message: `Product '${productName}' has reached low stock: only ${currentStock} left in stock.`,
      type: "inventory",
      link: "/admin/inventory",
    });
  }

  static async notifyNewOrder(orderNumber: string, amountFormatted: string) {
    return this.create({
      title: "New Order Placed",
      message: `Order #${orderNumber} placed for ${amountFormatted}.`,
      type: "order",
      link: "/admin/orders",
    });
  }

  static async notifyNewEnquiry(name: string, subject: string) {
    return this.create({
      title: "New Customer Enquiry",
      message: `${name} submitted an enquiry: "${subject}"`,
      type: "enquiry",
      link: "/admin/enquiries",
    });
  }
}

