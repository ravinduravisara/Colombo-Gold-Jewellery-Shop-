import mongoose, { Document, Schema } from "mongoose";

export interface IAuditLog extends Document {
  user: mongoose.Types.ObjectId;
  userName: string;
  userRole: string;
  action: string; // e.g. "PRODUCT_CREATE", "ORDER_STATUS_UPDATE", "SETTINGS_UPDATE"
  module: string; // e.g. "Products", "Orders", "Settings"
  details: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    userName: { type: String, required: true },
    userRole: { type: String, required: true },
    action: { type: String, required: true, index: true },
    module: { type: String, required: true, index: true },
    details: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

AuditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

