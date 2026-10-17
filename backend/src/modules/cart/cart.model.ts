import mongoose, { Document, Schema } from "mongoose";

export interface ICartItem {
  _id?: any;
  product: mongoose.Types.ObjectId;
  variantId?: string;
  quantity: number;
}

export interface ICart extends Document {
  user?: mongoose.Types.ObjectId;
  guestSessionId?: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: String,
    quantity: { type: Number, required: true, default: 1, min: 1 },
  },
  { _id: true }
);

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", index: true },
    guestSessionId: { type: String, index: true },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.model<ICart>("Cart", CartSchema);
