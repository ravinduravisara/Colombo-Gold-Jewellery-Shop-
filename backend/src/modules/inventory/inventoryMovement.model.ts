import mongoose, { Document, Schema } from "mongoose";

export interface IInventoryMovement extends Document {
  product: mongoose.Types.ObjectId;
  productName: string;
  sku: string;
  type: "in" | "out" | "adjustment" | "order_deduct" | "order_cancel_restore";
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceOrder?: string;
  reason?: string;
  performedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const InventoryMovementSchema = new Schema<IInventoryMovement>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    type: {
      type: String,
      enum: ["in", "out", "adjustment", "order_deduct", "order_cancel_restore"],
      required: true,
      index: true,
    },
    quantity: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    referenceOrder: String,
    reason: String,
    performedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const InventoryMovement = mongoose.model<IInventoryMovement>(
  "InventoryMovement",
  InventoryMovementSchema
);

