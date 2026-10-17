"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Upload,
  AlertCircle,
  Building,
} from "lucide-react";
import { orderService } from "@/services/orderService";
import { IOrder } from "@/types/order";
import { formatLKR } from "@/lib/formatCurrency";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/store/uiStore";

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get("orderNumber") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [identifier, setIdentifier] = useState("");
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [isUploadingSlip, setIsUploadingSlip] = useState(false);
  const { showToast } = useUIStore();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !identifier.trim()) {
      setErrorMsg("Please enter both your order number and contact email/phone.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg("");
      const result = await orderService.trackOrder(orderNumber.trim(), identifier.trim());
      setOrder(result);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "No order found with those details.");
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slipFile || !order) return;

    try {
      setIsUploadingSlip(true);
      const updated = await orderService.uploadReceipt(order._id, slipFile, "Commercial Bank of Ceylon");
      setOrder(updated);
      setSlipFile(null);
      showToast("Payment receipt uploaded successfully! We will verify it shortly.", "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to upload slip", "error");
    } finally {
      setIsUploadingSlip(false);
    }
  };

  const timelineSteps = ["pending", "confirmed", "processing", "shipped", "delivered"];
  const currentStepIdx = order ? timelineSteps.indexOf(order.orderStatus) : 0;

  return (
    <div className="py-12 bg-zinc-950 min-h-screen text-luxury-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-400 font-semibold mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Order Logistics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Track Your Jewellery Order
          </h1>
          <p className="mt-2 text-xs text-zinc-400">
            Enter your order number and the email address or phone number used during checkout.
          </p>
        </div>

        {/* Lookup Form */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/50 border border-zinc-850 mb-10 shadow-xl">
          <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6">
              <Input
                label="Order Reference Number *"
                required
                placeholder="e.g. CGC-202610-8291"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              />
            </div>
            <div className="sm:col-span-4">
              <Input
                label="Email or Phone Number *"
                required
                placeholder="priyanthi@example.com or 077..."
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2 flex items-end">
              <Button type="submit" variant="gold" size="md" className="w-full h-11" isLoading={isLoading}>
                <Search className="w-4 h-4 mr-1.5" />
                Track
              </Button>
            </div>
          </form>

          {errorMsg && (
            <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Order Details & Timeline Display */}
        {order && (
          <div className="rounded-3xl border border-zinc-850 bg-zinc-900/30 overflow-hidden shadow-2xl p-6 sm:p-10 space-y-8 animate-in slide-in-from-bottom-3 duration-200">
            {/* Header Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-850 gap-4">
              <div>
                <span className="text-xs text-zinc-500 uppercase tracking-wider">Order Status</span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-2xl font-serif font-bold text-white">{order.orderNumber}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${ORDER_STATUS_LABELS[order.orderStatus]?.color}`}>
                    {ORDER_STATUS_LABELS[order.orderStatus]?.label || order.orderStatus}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-zinc-400">
                <p>Placed on {new Date(order.createdAt).toLocaleDateString("en-LK", { dateStyle: "medium" })}</p>
                {order.trackingNumber && (
                  <p className="mt-1 font-mono text-gold-400 font-semibold">
                    Tracking #: {order.trackingNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Visual Timeline (if not cancelled) */}
            {order.orderStatus !== "cancelled" ? (
              <div className="py-4">
                <div className="grid grid-cols-5 gap-2 relative">
                  {timelineSteps.map((step, idx) => {
                    const isPassed = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div key={step} className="flex flex-col items-center text-center space-y-2">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                            isCurrent
                              ? "bg-gold-500 text-black shadow-gold scale-110"
                              : isPassed
                              ? "bg-zinc-800 text-gold-400 border border-gold-500/40"
                              : "bg-zinc-950 text-zinc-600 border border-zinc-850"
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={`text-[11px] font-medium capitalize ${isCurrent ? "text-gold-400 font-bold" : "text-zinc-500"}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                This order was cancelled. Any reserved stock has been restored to inventory.
              </div>
            )}

            {/* Bank Transfer Receipt Upload Box if Pending Verification */}
            {order.paymentMethod === "bank_transfer" && (
              <div className="p-6 rounded-2xl bg-zinc-950 border border-gold-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider">
                    <Building className="w-4 h-4" />
                    <span>Bank Transfer Verification</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${PAYMENT_STATUS_LABELS[order.paymentStatus]?.color}`}>
                    {PAYMENT_STATUS_LABELS[order.paymentStatus]?.label}
                  </span>
                </div>

                {order.paymentStatus === "paid" ? (
                  <p className="text-xs text-emerald-400 font-medium">
                    &bull; Your bank deposit was verified by our accounts department on{" "}
                    {order.bankTransferDetails?.verifiedAt
                      ? new Date(order.bankTransferDetails.verifiedAt).toLocaleDateString()
                      : "recently"}.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Please deposit the order total <strong>{formatLKR(order.totalAmount)}</strong> to Commercial Bank Account <strong>1000289192</strong> (Colombo Gold Covering - Kotte) and upload your slip below for instant verification.
                    </p>

                    <form onSubmit={handleUploadReceipt} className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        required
                        onChange={(e) => setSlipFile(e.target.files?.[0] || null)}
                        className="text-xs text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-gold-400"
                      />
                      <Button type="submit" variant="gold" size="sm" isLoading={isUploadingSlip} disabled={!slipFile}>
                        <Upload className="w-3.5 h-3.5 mr-1.5" />
                        Upload Receipt
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* Items Summary */}
            <div className="space-y-4 pt-4 border-t border-zinc-850">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-850 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg bg-zinc-900 overflow-hidden shrink-0">
                        {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-zinc-500">Qty: {item.quantity} {item.variantName ? `(${item.variantName})` : ""}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gold-400">{formatLKR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-850/60 text-xs text-zinc-400 space-y-1">
              <span className="font-semibold text-white block mb-1">Delivering To:</span>
              <p>{order.shippingAddress.fullName} &middot; {order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.district}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

