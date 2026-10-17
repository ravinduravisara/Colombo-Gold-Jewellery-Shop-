import mongoose, { Document, Schema } from "mongoose";

export interface IGalleryMedia extends Document {
  title: string;
  type: "image" | "tiktok";
  mediaUrl: string; // Direct image URL or TikTok video/embed URL
  thumbnailUrl?: string;
  caption?: string;
  tiktokUsername?: string;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryMediaSchema = new Schema<IGalleryMedia>(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["image", "tiktok"],
      required: true,
      default: "image",
    },
    mediaUrl: { type: String, required: true },
    thumbnailUrl: String,
    caption: String,
    tiktokUsername: { type: String, default: "@colombogoldcovering" },
    displayOrder: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        if (!ret.mediaType) {
          ret.mediaType = ret.type === "tiktok" ? "tiktok_video" : "image";
        }
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

GalleryMediaSchema.virtual("mediaType").get(function () {
  return this.type === "tiktok" ? "tiktok_video" : "image";
});

export const GalleryMedia = mongoose.model<IGalleryMedia>(
  "GalleryMedia",
  GalleryMediaSchema
);

