"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  Building,
  Upload,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Truck,
  Sparkles,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { formatLKR } from "@/lib/formatCurrency";
import { SRI_LANKAN_DISTRICTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orderService } from "@/services/orderService";
import { api } from "@/services/api";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, subtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { showToast } = useUIStore();

  const couponFromQuery = searchParams.get("coupon") || "";

  // Form states
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [addressLine1, setAddressLine1] = useState(user?.addresses?.[0]?.addressLine1 || "");
  const [addressLine2, setAddressLine2] = useState(user?.addresses?.[0]?.addressLine2 || "");
  const [city, setCity] = useState(user?.addresses?.[0]?.city || "");
  const [district, setDistrict] = useState<string>(user?.addresses?.[0]?.district || "Colombo");
  const [postalCode, setPostalCode] = useState(user?.addresses?.[0]?.postalCode || "");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank_transfer">("cod");
  const [bankReceiptFile, setBankReceiptFile] = useState<File | null>(null);

  const [shippingFee, setShippingFee] = useState(35000); // Rs. 350 default
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string>(couponFromQuery);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update shipping fee based on district
  useEffect(() => {
    if (subtotal >= 1500000) {
      setShippingFee(0); // Free shipping threshold
    } else if (district.toLowerCase() === "colombo") {
      setShippingFee(30000); // Rs. 300
    } else if (district.toLowerCase() === "gampaha" || district.toLowerCase() === "kalutara") {
      setShippingFee(35000); // Rs. 350
    } else {
      setShippingFee(40000); // Rs. 400
    }
  }, [district, subtotal]);

  // Validate coupon if passed from cart
  useEffect(() => {
    if (couponFromQuery && subtotal > 0) {
      api
        .post("/coupons/validate", { code: couponFromQuery, subtotal })
        .then((res) => {
          setDiscountAmount(res.data.data.discountAmount);
          setAppliedCoupon(res.data.data.code);
        })
        .catch(() => {});
    }
  }, [couponFromQuery, subtotal]);

  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!items || items.length === 0) {
      showToast("Your shopping bag is empty", "error");
      router.push("/cart");
      return;
    }

    if (!fullName || !email || !phone || !addressLine1 || !city || !district) {
      showToast("Please fill in all required delivery fields", "error");
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: {
          fullName,
          phone,
          email,
          addressLine1,
          addressLine2,
          city,
          district,
          postalCode,
          specialInstructions,
        },
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        paymentMethod,
        couponCode: appliedCoupon || undefined,
        notes: specialInstructions,
      };

      const createdOrder = await orderService.createOrder(orderPayload);

      // If bank transfer and receipt attached, upload receipt
      if (paymentMethod === "bank_transfer" && bankReceiptFile) {
        try {
          await orderService.uploadReceipt(createdOrder._id, bankReceiptFile, "Commercial Bank of Ceylon");
        } catch {
          showToast("Order placed, but receipt upload failed. You can re-upload on the tracking page.", "warning");
        }
      }

      await clearCart();
      router.push(`/order-success?orderNumber=${createdOrder.orderNumber}&email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to place order. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-24 bg-zinc-950 text-center">
        <h2 className="text-xl font-serif font-bold text-white mb-2">No Items in Bag</h2>
        <p className="text-xs text-zinc-400 mb-4">Please add products to your shopping bag before checking out.</p>
        <Link href="/shop">
          <Button variant="gold" size="sm">Browse Jewellery</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-zinc-950 min-h-screen text-luxury-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Secure Checkout</h1>
        <p className="text-xs text-zinc-400 mb-8">
          Complete your delivery details and choose your preferred Sri Lankan payment method.
        </p>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Columns: Delivery & Payment Details */}
            <div className="lg:col-span-7 space-y-8">
              {/* Delivery Details Card */}
              <div className="rounded-2xl border border-zinc-850 bg-zinc-900/40 p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-2 border-b border-zinc-850 pb-4">
                  <Truck className="w-5 h-5 text-gold-400" />
                  <h2 className="text-lg font-serif font-bold text-white">Delivery Address</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label="Full Name *"
                      required
                      placeholder="e.g. Priyanthi Jayasuriya"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Input
                      label="Contact Phone Number *"
                      type="tel"
                      required
                      placeholder="+94 77 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <Input
                      label="Email Address *"
                      type="email"
                      required
                      placeholder="priyanthi@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Input
                      label="Street Address (Line 1) *"
                      required
                      placeholder="No. 45/A, Temple Road"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Input
                      label="Apartment, Suite, Unit (Optional)"
                      placeholder="Floor 2, Apt 4B"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                    />
                  </div>

                  <div>
                    <Input
                      label="City / Town *"
                      required
                      placeholder="e.g. Kotte, Nugegoda, Kandy"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 tracking-wide uppercase mb-1.5">
                      District (Sri Lanka) *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="flex h-11 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-white focus:border-gold-500 focus:outline-none"
                    >
                      {SRI_LANKAN_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-zinc-300 tracking-wide uppercase mb-1.5">
                      Special Delivery Instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Nearest landmark, gate color, or preferred courier delivery time..."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="w-full p-3 rounded-md border border-zinc-800 bg-zinc-950 text-sm text-white placeholder-zinc-500 focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="rounded-2xl border border-zinc-850 bg-zinc-900/40 p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-2 border-b border-zinc-850 pb-4">
                  <CreditCard className="w-5 h-5 text-gold-400" />
                  <h2 className="text-lg font-serif font-bold text-white">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  {/* Cash on Delivery option */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-gold-500 bg-gold-500/10 shadow-gold"
                        : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mt-1 text-gold-500 focus:ring-gold-500"
                    />
                    <div>
                      <span className="text-sm font-bold text-white">Cash on Delivery (COD)</span>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Pay cash directly to the courier representative when your parcel is delivered to your doorstep.
                      </p>
                    </div>
                  </label>

                  {/* Bank Transfer option */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "bank_transfer"
                        ? "border-gold-500 bg-gold-500/10 shadow-gold"
                        : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === "bank_transfer"}
                      onChange={() => setPaymentMethod("bank_transfer")}
                      className="mt-1 text-gold-500 focus:ring-gold-500"
                    />
                    <div>
                      <span className="text-sm font-bold text-white">Direct Bank Transfer</span>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Transfer to our verified Commercial Bank account and upload payment receipt for priority order processing.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Bank Details Display if Bank Transfer selected */}
                {paymentMethod === "bank_transfer" && (
                  <div className="p-5 rounded-xl bg-zinc-950 border border-gold-500/40 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2 text-gold-400 font-semibold text-xs uppercase tracking-wider">
                      <Building className="w-4 h-4" />
                      <span>Verified Business Account Details</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-zinc-500 block">Bank Name</span>
                        <strong className="text-white">Commercial Bank of Ceylon</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Branch</span>
                        <strong className="text-white">Kotte Branch</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Account Name</span>
                        <strong className="text-white">Colombo Gold Covering</strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Account Number</span>
                        <strong className="text-gold-400 font-mono text-sm">1000289192</strong>
                      </div>
                    </div>

                    {/* Receipt Upload Input */}
                    <div className="pt-2 border-t border-zinc-850">
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Upload Transfer Slip / Screenshot (Optional at checkout):
                      </label>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setBankReceiptFile(e.target.files?.[0] || null)}
                        className="block w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-gold-400 hover:file:bg-zinc-700 cursor-pointer"
                      />
                      <p className="text-[11px] text-zinc-500 mt-1">
                        You can also WhatsApp the transfer slip to +94 77 123 4567 along with your order number.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right 5 Columns: Order Summary Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-zinc-850 bg-zinc-900/40 p-6 sm:p-8 space-y-6 sticky top-28 shadow-xl">
                <h2 className="text-lg font-serif font-bold text-white border-b border-zinc-850 pb-4">
                  Order Items ({items.reduce((s, i) => s + i.quantity, 0)})
                </h2>

                {/* Items List */}
                <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                  {items.map((item) => (
                    <div key={item._id} className="flex gap-3 items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0">
                          {item.image && (
                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white line-clamp-1">{item.name}</p>
                          <p className="text-[11px] text-zinc-400">Qty: {item.quantity} {item.variantName ? `(${item.variantName})` : ""}</p>
                        </div>
                      </div>
                      <span className="font-bold text-white">{formatLKR(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="space-y-3 text-xs border-t border-zinc-850 pt-4">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">{formatLKR(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Discount ({appliedCoupon})</span>
                      <span>-{formatLKR(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-400">
                    <span>Courier Delivery ({district})</span>
                    <span className="font-semibold text-white">
                      {shippingFee === 0 ? "FREE" : formatLKR(shippingFee)}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-white pt-4 border-t border-zinc-850">
                    <span>Total Amount Due</span>
                    <span className="text-gold-400 text-lg">{formatLKR(totalAmount)}</span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full font-bold shadow-gold"
                  isLoading={isSubmitting}
                >
                  <span>Place Jewellery Order</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <div className="pt-2 text-center">
                  <span className="text-[11px] text-zinc-500">
                    By placing your order, you agree to our 6-Month Gold-Covering Guarantee & Delivery Terms.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

