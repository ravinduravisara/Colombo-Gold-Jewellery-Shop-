import { mailTransporter } from "../config/mail";
import { ENV } from "../config/env";
import { logger } from "../utils/logger";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  static async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!ENV.SMTP.USER && ENV.NODE_ENV !== "test") {
        logger.info(`[Email Skipped - SMTP Not Configured] To: ${options.to} | Subject: ${options.subject}`);
        return true;
      }

      await mailTransporter.sendMail({
        from: ENV.SMTP.FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      logger.info(`[Email Sent] To: ${options.to} | Subject: ${options.subject}`);
      return true;
    } catch (error) {
      logger.error(`[Email Failed] To: ${options.to} | Subject: ${options.subject}`, error);
      return false;
    }
  }

  static async sendOrderConfirmation(order: any, customerEmail: string): Promise<boolean> {
    const itemsListHtml = order.items
      .map(
        (item: any) =>
          `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${item.name} ${item.variantName ? `(${item.variantName})` : ""}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; text-align: right;">Rs. ${(item.price / 100).toLocaleString("en-LK", { minimumFractionDigits: 2 })}</td>
          </tr>`
      )
      .join("");

    const totalLKR = (order.totalAmount / 100).toLocaleString("en-LK", { minimumFractionDigits: 2 });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #c6a667; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #c6a667; margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 2px;">Colombo Gold Covering</h1>
          <p style="color: #666; margin: 5px 0 0 0; font-size: 13px;">Premium Gold-Covered & Gold-Plated Jewellery</p>
        </div>
        <h2 style="color: #111; font-size: 18px;">Thank You for Your Order!</h2>
        <p>Your order <strong>${order.orderNumber}</strong> has been received and is being processed.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #faf8f3; color: #111; text-align: left;">
              <th style="padding: 8px;">Item</th>
              <th style="padding: 8px; text-align: center;">Qty</th>
              <th style="padding: 8px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsListHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 12px 8px; font-weight: bold; text-align: right;">Total Amount:</td>
              <td style="padding: 12px 8px; font-weight: bold; text-align: right; color: #c6a667; font-size: 16px;">Rs. ${totalLKR}</td>
            </tr>
          </tfoot>
        </table>

        <div style="background-color: #faf8f3; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #111; font-size: 14px;">Delivery Address</h3>
          <p style="margin: 0; color: #555; font-size: 13px;">
            ${order.shippingAddress.fullName}<br/>
            ${order.shippingAddress.addressLine1}${order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}<br/>
            ${order.shippingAddress.city}, ${order.shippingAddress.district}<br/>
            Phone: ${order.shippingAddress.phone}
          </p>
        </div>

        <p style="font-size: 13px; color: #777;">
          Need assistance or want to follow up via WhatsApp? Message us at +94 77 123 4567.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: customerEmail,
      subject: `Order Confirmation - ${order.orderNumber} | Colombo Gold Covering`,
      html,
    });
  }

  static async sendPasswordReset(email: string, resetUrl: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #c6a667; border-radius: 8px;">
        <h2 style="color: #c6a667;">Reset Your Password</h2>
        <p>You requested a password reset for your Colombo Gold Covering account.</p>
        <p>Click the link below to set a new password. This link will expire in 10 minutes:</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${resetUrl}" style="background-color: #c6a667; color: #111; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 12px; color: #888;">If you didn't request this reset, you can safely ignore this email.</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: "Password Reset Request | Colombo Gold Covering",
      html,
    });
  }
}

