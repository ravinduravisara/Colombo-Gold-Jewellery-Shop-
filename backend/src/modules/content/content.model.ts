import mongoose, { Document, Schema } from "mongoose";

export interface IContentPage extends Document {
  slug: string; // e.g. "about-us", "faq", "warranty", "privacy-policy", "terms"
  title: string;
  content: string; // Formatted HTML or Markdown
  metaTitle?: string;
  metaDescription?: string;
  sections?: Array<{ title: string; content: string }>;
  isPublished: boolean;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContentPageSchema = new Schema<IContentPage>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    metaTitle: String,
    metaDescription: String,
    sections: [
      {
        title: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
    isPublished: { type: Boolean, default: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const ContentPage = mongoose.model<IContentPage>("ContentPage", ContentPageSchema);

