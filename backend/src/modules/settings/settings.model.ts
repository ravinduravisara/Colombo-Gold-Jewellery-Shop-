import mongoose, { Document, Schema } from "mongoose";

export interface IBankDetails {
  bankName: string;
  branchName: string;
  accountName: string;
  accountNumber: string;
  instructions?: string;
  isActive: boolean;
}

export interface IWebsiteSettings extends Document {
  storeName: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string; // Sri Lankan number without + e.g. 94771234567
  address: string;
  city: string;
  district: string;
  country: string;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number; // In minor units
  defaultDeliveryFee: number; // In minor units
  bankDetails: IBankDetails;
  socialLinks: {
    tiktok: string;
    facebook: string;
    instagram: string;
    youtube?: string;
  };
  announcementBar: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
  };
  enableCod: boolean;
  enableBankTransfer: boolean;
  enableDirectWhatsApp: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BankDetailsSchema = new Schema<IBankDetails>(
  {
    bankName: { type: String, default: "Commercial Bank of Ceylon" },
    branchName: { type: String, default: "Kotte Branch" },
    accountName: { type: String, default: "Colombo Gold Covering" },
    accountNumber: { type: String, default: "1000289192" },
    instructions: {
      type: String,
      default:
        "Please transfer the total order amount to the bank account above and upload your payment slip/screenshot for immediate verification.",
    },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const WebsiteSettingsSchema = new Schema<IWebsiteSettings>(
  {
    storeName: { type: String, default: "Colombo Gold Covering" },
    tagline: { type: String, default: "Sri Lanka's Premier Gold-Covered & Gold-Plated Jewellery" },
    logoUrl: String,
    faviconUrl: String,
    contactEmail: { type: String, default: "info@colombogoldcovering.lk" },
    contactPhone: { type: String, default: "+94 11 288 9000" },
    whatsappNumber: { type: String, default: "94771234567" },
    address: { type: String, default: "Sri Jayawardenepura Kotte, Colombo" },
    city: { type: String, default: "Kotte" },
    district: { type: String, default: "Colombo" },
    country: { type: String, default: "Sri Lanka" },
    currency: { type: String, default: "LKR" },
    currencySymbol: { type: String, default: "Rs." },
    freeShippingThreshold: { type: Number, default: 1500000 }, // Rs. 15,000 (1500000 cents)
    defaultDeliveryFee: { type: Number, default: 35000 }, // Rs. 350 (35000 cents)
    bankDetails: { type: BankDetailsSchema, default: () => ({}) },
    socialLinks: {
      tiktok: { type: String, default: "https://www.tiktok.com/@colombogoldcovering" },
      facebook: { type: String, default: "https://facebook.com/colombogoldcovering" },
      instagram: { type: String, default: "https://instagram.com/colombogoldcovering" },
      youtube: { type: String, default: "" },
    },
    announcementBar: {
      enabled: { type: Boolean, default: true },
      text: {
        type: String,
        default: "✨ Islandwide Delivery Across Sri Lanka | Premium 6-Month Warranty Included! ✨",
      },
      link: { type: String, default: "/shop" },
    },
    seo: {
      metaTitle: {
        type: String,
        default: "Colombo Gold Covering — Premium Gold-Plated Jewellery Sri Lanka",
      },
      metaDescription: {
        type: String,
        default:
          "Discover exquisite gold-covered and gold-plated necklaces, bangles, earrings, and chains crafted with high micro-gold plating and backed by warranty in Sri Lanka.",
      },
      metaKeywords: {
        type: [String],
        default: [
          "gold covered jewellery sri lanka",
          "gold plated jewellery colombo",
          "gold covering necklace",
          "kotte jewellery",
        ],
      },
    },
    enableCod: { type: Boolean, default: true },
    enableBankTransfer: { type: Boolean, default: true },
    enableDirectWhatsApp: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const WebsiteSettings = mongoose.model<IWebsiteSettings>(
  "WebsiteSettings",
  WebsiteSettingsSchema
);

