import mongoose, { Document, Schema } from "mongoose";

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  position: "hero" | "promo" | "popup";
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    imageUrl: { type: String, required: true },
    buttonText: { type: String, default: "Shop Collection" },
    buttonLink: { type: String, default: "/shop" },
    secondaryButtonText: { type: String, default: "Explore Offers" },
    secondaryButtonLink: { type: String, default: "/offers" },
    position: {
      type: String,
      enum: ["hero", "promo", "popup"],
      default: "hero",
      index: true,
    },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const Banner = mongoose.model<IBanner>("Banner", BannerSchema);

