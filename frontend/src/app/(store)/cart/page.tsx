"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatLKR } from "@/lib/formatCurrency";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { useUIStore } from "@/store/uiStore";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart, isLoading } = useCartStore();
  const { showToast } = useUIStore();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const freeDeliveryThreshold = 1500000; // Rs. 15,000
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const estimatedTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setIsValidatingCoupon(true);
      const res = await api.post("/coupons/validate", {
        code: couponCode.trim(),
        subtotal,
      });
      setAppliedCoupon(res.data.data);
      showToast(`Coupon ${res.data.data.code} applied successfully!`, "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Invalid coupon code", "error");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  if (items.length === 0) {
    return (
      <div className="py-24 bg-zinc-950 min-h-[70vh] flex items-center justify-center text-luxury-ivory text-center px-4">
        <div className="max-w-md space-y-4">
          <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">Your Shopping Bag is Empty</h1>
          <p className="text-xs text-zinc-400">
            Looks like you haven&apos;t added any gold-covered jewellery yet. Explore our bridal chokers, necklaces, and bangles.
          </p>
          <div className="pt-2">
            <Link href="/shop">
              <Button variant="gold" size="md">
                Browse Collections
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-zinc-950 min-h-screen text-luxury-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Shopping Cart</h1>
        <p className="text-xs text-zinc-400 mb-8">
          Review your chosen jewellery pieces before secure checkout.
        </p>

        {/* Free Shipping Progress Indicator */}
        <div className="mb-8 p-4 rounded-xl bg-zinc-900/60 border border-zinc-850 flex items-center gap-3">
          <Truck className="w-5 h-5 text-gold-400 shrink-0" />
          <div className="flex-1 text-xs">
            {isFreeDelivery ? (
              <span className="text-emerald-400 font-semibold">
                Congratulations! Your order qualifies for <strong>Free Express Islandwide Delivery</strong>.
              </span>
            ) : (
              <span>
                Add <strong className="text-gold-400">{formatLKR(remainingForFreeDelivery)}</strong> more to unlock <strong>Free Islandwide Express Delivery</strong>!
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-zinc-850 bg-zinc-900/30 overflow-hidden">
              <div className="divide-y divide-zinc-850">
                {items.map((item) => (
                  <div key={item._id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Image */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-700">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div>
                        <Link href={`/product/${item.slug}`} className="text-sm font-semibold text-white hover:text-gold-400 transition-colors">
                          {item.name}
                        </Link>
                        {item.variantName && (
                          <p className="text-xs text-zinc-400 mt-0.5">{item.variantName}</p>
                        )}
                        <p className="text-xs text-zinc-500 mt-0.5">SKU: {item.sku}</p>
                        <p className="text-sm font-bold text-gold-400 mt-1 sm:hidden">
                          {formatLKR(item.price)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Line Total */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-zinc-850">
                      <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={isLoading}
                          className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={isLoading || item.quantity >= item.availableStock}
                          className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white">{formatLKR(item.price * item.quantity)}</p>
                        {item.quantity > 1 && (
                          <p className="text-[11px] text-zinc-500">{formatLKR(item.price)} each</p>
                        )}
                      </div>

                      <button
                        onClick={() => removeItem(item._id)}
                        className="p-2 text-zinc-500 hover:text-rose-400 transition-colors"
                        title="Remove from bag"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link href="/shop" className="text-xs text-gold-400 hover:underline">
                &larr; Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-xs text-zinc-500 hover:text-rose-400 transition-colors"
              >
                Clear Entire Bag
              </button>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-850 bg-zinc-900/40 p-6 space-y-6 shadow-xl">
              <h2 className="text-lg font-serif font-bold text-white">Order Summary</h2>

              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-{formatLKR(appliedCoupon.discountAmount)})</span>
                    </div>
                    <button onClick={removeCoupon} className="text-zinc-400 hover:text-white text-xs underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. GOLD10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 h-10 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 uppercase focus:outline-none focus:border-gold-500"
                    />
                    <Button type="submit" variant="secondary" size="sm" isLoading={isValidatingCoupon}>
                      Apply
                    </Button>
                  </form>
                )}
              </div>

              {/* Calculations */}
              <div className="space-y-3 text-xs border-t border-zinc-850 pt-4">
                <div className="flex justify-between text-zinc-400">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-white">{formatLKR(subtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>-{formatLKR(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400">
                  <span>Estimated Delivery</span>
                  <span className="text-zinc-300">
                    {isFreeDelivery ? "FREE" : "Calculated at checkout"}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-zinc-850">
                  <span>Subtotal Due</span>
                  <span className="text-gold-400 text-base">{formatLKR(estimatedTotal)}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <Link href={`/checkout${appliedCoupon ? `?coupon=${appliedCoupon.code}` : ""}`}>
                <Button variant="gold" size="lg" className="w-full font-bold">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Assurance Box */}
            <div className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-850/60 space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>Our Purchase Guarantees</span>
              </div>
              <p>&bull; Cash on Delivery available across all Sri Lankan districts.</p>
              <p>&bull; 6-Month warranty certificate included with package.</p>
              <p>&bull; Verified bank transfer option with instant receipt verification.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

