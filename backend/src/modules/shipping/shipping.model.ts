import mongoose, { Document, Schema } from "mongoose";

export interface IShippingZone extends Document {
  district: string; // e.g., "Colombo", "Gampaha", "Kandy", "All Island"
  deliveryFee: number; // In LKR minor units
  estimatedDays: string; // e.g. "1-2 Business Days"
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ShippingZoneSchema = new Schema<IShippingZone>(
  {
    district: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
      min: 0,
    },
    estimatedDays: {
      type: String,
      required: true,
      default: "2-4 Business Days",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ShippingZone = mongoose.model<IShippingZone>("ShippingZone", ShippingZoneSchema);

