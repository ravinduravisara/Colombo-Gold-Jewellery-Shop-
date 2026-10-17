import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  type: "order" | "inventory" | "enquiry" | "review" | "system";
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["order", "inventory", "enquiry", "review", "system"],
      default: "system",
      index: true,
    },
    isRead: { type: Boolean, default: false, index: true },
    link: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);

