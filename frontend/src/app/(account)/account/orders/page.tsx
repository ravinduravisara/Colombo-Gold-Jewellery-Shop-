"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { useSearchParams } from "next/navigation";
import {
  Package,
  Calendar,
  CreditCard,
  MapPin,
  ChevronDown,
  ChevronUp,
  Upload,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
} from "lucide-react";
import { orderService } from "@/services/orderService";
import { IOrder } from "@/types/order";
import { formatLKR } from "@/lib/formatCurrency";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";

function OrdersListContent() {
  const searchParams = useSearchParams();
  const highlightedOrderId = searchParams.get("id");
  const { showToast } = useUIStore();

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    highlightedOrderId || null
  );
  const [uploadingOrderId, setUploadingOrderId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bankName, setBankName] = useState("");
  const [isSubmittingReceipt, setIsSubmittingReceipt] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      try {
        setIsLoading(true);
        const data = await orderService.getMyOrders();
        setOrders(data.orders || []);
        if (highlightedOrderId) {
          setExpandedOrderId(highlightedOrderId);
        }
      } catch (err) {
        console.error("Failed to fetch customer orders:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, [highlightedOrderId]);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleReceiptUpload = async (orderId: string) => {
    if (!selectedFile) {
      showToast("Please choose an image file of your bank slip", "error");
      return;
    }
    try {
      setIsSubmittingReceipt(true);
      const updatedOrder = await orderService.uploadReceipt(
        orderId,
        selectedFile,
        bankName.trim() || undefined
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updatedOrder : o))
      );
      setUploadingOrderId(null);
      setSelectedFile(null);
      setBankName("");
      showToast("Deposit receipt submitted successfully for verification!", "success");
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Failed to upload deposit slip",
        "error"
      );
    } finally {
      setIsSubmittingReceipt(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-400">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs uppercase tracking-wider">Loading your order history...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-10 text-center space-y-4">
        <Package className="w-12 h-12 text-zinc-600 mx-auto" />
        <h3 className="text-lg font-serif font-bold text-white">No Orders Found</h3>
        <p className="text-sm text-zinc-400 max-w-sm mx-auto">
          Explore our handcrafted gold-covered and gold-plated collections to place your first order.
        </p>
        <Link href="/shop">
          <Button>Browse Catalogue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-white">Order History</h2>
            <p className="text-xs text-zinc-400">
              Showing {orders.length} order{orders.length === 1 ? "" : "s"}
            </p>
          </div>
          <Link href="/track-order">
            <Button variant="outline" size="sm" className="text-xs">
              Live Courier Tracking
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order._id;
          const isBankPending =
            order.paymentMethod === "bank_transfer" &&
            order.paymentStatus === "pending";

          return (
            <div
              key={order._id}
              className={`bg-zinc-900/40 border rounded-2xl transition-all overflow-hidden ${
                isExpanded ? "border-gold-500/50 shadow-lg" : "border-zinc-800 hover:border-zinc-700"
              }`}
            >
              {/* Order Header / Summary Row */}
              <div
                onClick={() => toggleExpand(order._id)}
                className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center flex-wrap gap-2.5">
                    <span className="font-serif font-bold text-base text-white">
                      #{order.orderNumber}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium ${
                        order.orderStatus === "delivered"
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                          : order.orderStatus === "cancelled"
                          ? "bg-red-950/60 text-red-400 border border-red-500/30"
                          : order.orderStatus === "shipped"
                          ? "bg-blue-950/60 text-blue-400 border border-blue-500/30"
                          : "bg-amber-950/60 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium ${
                        order.paymentStatus === "paid"
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20"
                          : order.paymentStatus === "failed"
                          ? "bg-red-950/40 text-red-400 border border-red-500/20"
                          : "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      Payment: {order.paymentStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span>{order.items.length} item(s)</span>
                    <span>•</span>
                    <span className="capitalize">
                      {order.paymentMethod?.replace("_", " ") || "COD"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-5">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-zinc-400 block uppercase font-medium">
                      Total Amount
                    </span>
                    <span className="font-serif font-bold text-gold-400 text-lg">
                      {formatLKR(order.totalAmount)}
                    </span>
                  </div>

                  <div className="p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-800/40">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-zinc-800/80 p-5 sm:p-6 bg-zinc-950/60 space-y-6">
                  {/* Items List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Purchased Items
                    </h4>
                    <div className="divide-y divide-zinc-800/60">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="py-3 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden relative flex-shrink-0">
                              <SafeImage
                                src={item.image || "/images/placeholders/necklace.jpg"}
                                alt={item.name || item.title || "Jewellery"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{item.name || item.title}</p>
                              {item.variantName && (
                                <p className="text-xs text-gold-400/80">
                                  Variant: {item.variantName}
                                </p>
                              )}
                              <p className="text-xs text-zinc-400">
                                Qty: {item.quantity} × {formatLKR(item.price)}
                              </p>
                            </div>
                          </div>
                          <span className="font-serif font-medium text-white text-sm">
                            {formatLKR(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary & Shipping Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-zinc-800/60">
                    <div className="space-y-2 text-xs text-zinc-300">
                      <span className="font-semibold uppercase tracking-wider text-zinc-400 block">
                        Delivery Address
                      </span>
                      <p className="font-medium text-white">
                        {order.shippingAddress.fullName}
                      </p>
                      <p>{order.shippingAddress.addressLine1}</p>
                      {order.shippingAddress.addressLine2 && (
                        <p>{order.shippingAddress.addressLine2}</p>
                      )}
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.district}
                      </p>
                      <p className="text-zinc-400">
                        Phone: {order.shippingAddress.phone}
                      </p>
                      {order.trackingNumber && (
                        <div className="mt-3 p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-blue-300">
                          <span className="font-semibold block mb-0.5">
                            Tracking Number: {order.trackingNumber}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            Dispatched via registered island-wide courier service.
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-xs bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
                      <div className="flex justify-between text-zinc-400">
                        <span>Subtotal:</span>
                        <span>{formatLKR(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Delivery Fee:</span>
                        <span>
                          {order.shippingFee === 0 ? "FREE" : formatLKR(order.shippingFee)}
                        </span>
                      </div>
                      {order.discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Discount:</span>
                          <span>-{formatLKR(order.discountAmount)}</span>
                        </div>
                      )}
                      <div className="border-t border-zinc-800 pt-2 flex justify-between font-serif font-bold text-white text-sm">
                        <span>Total Paid / Payable:</span>
                        <span className="text-gold-400">{formatLKR(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bank Transfer Receipt Section */}
                  {isBankPending && (
                    <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                      <div className="flex items-center gap-2 text-amber-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          Bank Transfer Payment Pending
                        </span>
                      </div>

                      {order.bankReceiptUrl ? (
                        <div className="space-y-2">
                          <p className="text-xs text-zinc-300">
                            You have submitted a payment receipt. Our accounts department is verifying the deposit.
                          </p>
                          <a
                            href={order.bankReceiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 underline"
                          >
                            <span>View uploaded deposit slip</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-xs text-zinc-300">
                            Please upload a photo or screenshot of your bank deposit slip or online transfer receipt to proceed with dispatch.
                          </p>
                          {uploadingOrderId === order._id ? (
                            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                              <input
                                type="text"
                                placeholder="Bank Name (e.g. Commercial Bank, BOC)"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                className="w-full text-xs px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="text-xs text-zinc-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-gold-500/20 file:text-gold-300 hover:file:bg-gold-500/30"
                              />
                              <div className="flex items-center gap-2 pt-1">
                                <Button
                                  size="sm"
                                  disabled={isSubmittingReceipt || !selectedFile}
                                  onClick={() => handleReceiptUpload(order._id)}
                                >
                                  {isSubmittingReceipt ? "Uploading..." : "Submit Receipt"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setUploadingOrderId(null);
                                    setSelectedFile(null);
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setUploadingOrderId(order._id)}
                              className="text-xs border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
                            >
                              <Upload className="w-3.5 h-3.5 mr-2" />
                              Upload Deposit Receipt
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CustomerOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-400">
          Loading order details...
        </div>
      }
    >
      <OrdersListContent />
    </Suspense>
  );
}
