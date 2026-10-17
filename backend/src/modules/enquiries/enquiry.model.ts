import mongoose, { Document, Schema } from "mongoose";

export interface ICustomerEnquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "pending" | "responded";
  responseNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerEnquirySchema = new Schema<ICustomerEnquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "responded"],
      default: "pending",
      index: true,
    },
    responseNotes: String,
  },
  {
    timestamps: true,
  }
);

export const CustomerEnquiry = mongoose.model<ICustomerEnquiry>(
  "CustomerEnquiry",
  CustomerEnquirySchema
);

