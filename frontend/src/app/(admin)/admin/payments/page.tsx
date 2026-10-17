"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  DollarSign,
  Clock,
  Check,
  X,
  FileCheck,
} from "lucide-react";
import { orderService } from "@/services/orderService";
import { IOrder } from "@/types/order";
import { formatLKR } from "@/lib/formatCurrency";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";

export default function AdminPaymentsPage() {
  const { showToast } = useUIStore();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [filter, setFilter] = useState<"all" | "pending_bank" | "paid" | "cod">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [previewReceipt, setPreviewReceipt] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await orderService.listAdminOrders({ limit: 50 });
      setOrders(res.orders || []);
    } catch (err) {
      console.error("Failed to load payments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleVerify = async (orderId: string, isApproved: boolean) => {
    try {
      await orderService.verifyPayment(orderId, isApproved);
      showToast(isApproved ? "Bank deposit payment cleared" : "Receipt rejected", "success");
      fetchOrders();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Verification failed", "error");
    }
  };

  // Filter logic
  const filteredOrders = orders.filter((o) => {
    if (filter === "pending_bank") {
      return o.paymentMethod === "bank_transfer" && o.paymentStatus === "pending";
    }
    if (filter === "paid") {
      return o.paymentStatus === "paid";
    }
    if (filter === "cod") {
      return o.paymentMethod === "cod";
    }
    return true;
  });

  const totalCollected = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const pendingWire = orders
    .filter((o) => o.paymentMethod === "bank_transfer" && o.paymentStatus === "pending")
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Payment Monitoring & Bank Clearance</h2>
          <p className="text-xs text-zinc-400">
            Reconcile direct bank deposits, slip uploads, and Cash on Delivery transactions
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              Total Verified Revenue
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-white mt-3">
            {formatLKR(totalCollected)}
          </p>
        </div>

        <div className="bg-zinc-900/40 border border-amber-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
              Pending Bank Deposits
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-amber-300 mt-3">
            {formatLKR(pendingWire)}
          </p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              Total Transactions
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-serif font-bold text-white mt-3">{orders.length}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 text-xs">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
            filter === "all" ? "bg-gold-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
          }`}
        >
          All Payments
        </button>
        <button
          onClick={() => setFilter("pending_bank")}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
            filter === "pending_bank" ? "bg-gold-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
          }`}
        >
          Pending Bank Clearance
        </button>
        <button
          onClick={() => setFilter("paid")}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
            filter === "paid" ? "bg-gold-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
          }`}
        >
          Paid & Cleared
        </button>
        <button
          onClick={() => setFilter("cod")}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
            filter === "cod" ? "bg-gold-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
          }`}
        >
          Cash On Delivery (COD)
        </button>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-zinc-500 text-xs">Loading payment transactions...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs">No payment records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px] bg-zinc-950/40">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Method</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Receipt Slip</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-800/30">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3.5 px-3 text-zinc-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-3 text-zinc-300">
                      {order.shippingAddress?.fullName}
                    </td>
                    <td className="py-3.5 px-3 capitalize text-zinc-300">
                      {order.paymentMethod?.replace("_", " ")}
                    </td>
                    <td className="py-3.5 px-3 font-serif font-bold text-gold-400">
                      {formatLKR(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full capitalize text-[10px] font-semibold ${
                          order.paymentStatus === "paid"
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-950/60 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      {order.bankReceiptUrl ? (
                        <button
                          onClick={() => setPreviewReceipt(order.bankReceiptUrl || null)}
                          className="text-gold-400 hover:text-gold-300 font-medium inline-flex items-center gap-1 underline text-[11px]"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>View Slip</span>
                        </button>
                      ) : order.paymentMethod === "bank_transfer" ? (
                        <span className="text-[11px] text-zinc-500 italic">Awaiting slip</span>
                      ) : (
                        <span className="text-[11px] text-zinc-500">N/A</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {order.paymentMethod === "bank_transfer" &&
                        order.paymentStatus === "pending" && (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => handleVerify(order._id, true)}
                              className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-2"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerify(order._id, false)}
                              className="h-7 text-xs border-red-500/40 text-red-400 px-2"
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slip Preview Modal */}
      {previewReceipt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-gold-500/40 rounded-2xl max-w-xl w-full p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="font-serif font-bold text-white text-sm">
                Bank Deposit Slip Inspection
              </span>
              <button
                onClick={() => setPreviewReceipt(null)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-[4/3] w-full bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800">
              <Image src={previewReceipt} alt="Deposit Slip" fill className="object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

