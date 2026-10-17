import { IAddress } from "./user";

export interface IOrderItem {
  _id?: string;
  product: string | { _id: string; name: string; slug: string };
  name: string;
  title?: string;
  sku: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  price: number; // LKR cents
  image: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer?: string | { _id: string; name: string; email: string; phone?: string };
  user?: string | { _id: string; name: string; email: string; phone?: string };
  customerEmail: string;
  customerPhone: string;
  shippingAddress: IAddress & { specialInstructions?: string };
  items: IOrderItem[];
  paymentMethod: "cod" | "bank_transfer" | "card";
  paymentStatus: "pending" | "pending_verification" | "paid" | "failed" | "refunded";
  bankTransferDetails?: {
    receiptUrl?: string;
    bankName?: string;
    transactionReference?: string;
    uploadedAt?: string;
    verifiedAt?: string;
    rejectionReason?: string;
  };
  bankReceiptUrl?: string;
  orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotalAmount: number; // In LKR cents
  subtotal?: number;
  discountAmount: number;
  couponCode?: string;
  shippingFee: number;
  totalAmount: number; // In LKR cents
  trackingNumber?: string;
  courierPartner?: string;
  notes?: string;
  cancellationReason?: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    comment?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

