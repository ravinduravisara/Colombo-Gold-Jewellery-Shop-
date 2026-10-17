import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  price: number; // LKR minor units
  image: string;
}

export interface IOrderShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  postalCode?: string;
  specialInstructions?: string;
}

export interface IOrderBankTransfer {
  receiptUrl?: string;
  bankName?: string;
  transactionReference?: string;
  uploadedAt?: Date;
  verifiedAt?: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  rejectionReason?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer?: mongoose.Types.ObjectId;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: IOrderShippingAddress;
  items: IOrderItem[];
  paymentMethod: "cod" | "bank_transfer" | "card";
  paymentStatus: "pending" | "pending_verification" | "paid" | "failed" | "refunded";
  bankTransferDetails?: IOrderBankTransfer;
  orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  subtotalAmount: number; // In minor units
  discountAmount: number;
  couponCode?: string;
  shippingFee: number;
  totalAmount: number; // In minor units
  trackingNumber?: string;
  courierPartner?: string;
  notes?: string;
  cancellationReason?: string;
  statusHistory: Array<{ status: string; timestamp: Date; updatedBy?: mongoose.Types.ObjectId; comment?: string }>;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    variantId: String,
    variantName: String,
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
  },
  { _id: true }
);

const ShippingAddressSchema = new Schema<IOrderShippingAddress>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    district: { type: String, required: true },
    postalCode: String,
    specialInstructions: String,
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    shippingAddress: {
      type: ShippingAddressSchema,
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: [(v: any[]) => v.length > 0, "Order must have at least one item"],
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "bank_transfer", "card"],
      required: true,
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "pending_verification", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    bankTransferDetails: {
      receiptUrl: String,
      bankName: String,
      transactionReference: String,
      uploadedAt: Date,
      verifiedAt: Date,
      verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
      rejectionReason: String,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
    subtotalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    couponCode: String,
    shippingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    trackingNumber: String,
    courierPartner: String,
    notes: String,
    cancellationReason: String,
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
        comment: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ createdAt: -1, orderStatus: 1 });

export const Order = mongoose.model<IOrder>("Order", OrderSchema);

