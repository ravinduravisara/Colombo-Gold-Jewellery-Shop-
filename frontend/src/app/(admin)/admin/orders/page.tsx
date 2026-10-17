"use client";

import React, { useEffect, useState, Suspense } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Truck,
  Eye,
  X,
  CreditCard,
  MapPin,
  Calendar,
  Filter,
} from "lucide-react";
import { orderService } from "@/services/orderService";
import { IOrder } from "@/types/order";
import { formatLKR } from "@/lib/formatCurrency";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("id");
  const { showToast } = useUIStore();

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await orderService.listAdminOrders({
        page,
        limit: 15,
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: search.trim() || undefined,
      });
      setOrders(res.orders || []);
      setTotalPages(res.meta?.totalPages || res.meta?.pages || 1);

      if (highlightId && !selectedOrder) {
        const found = res.orders?.find((o: IOrder) => o._id === highlightId);
        if (found) {
          setSelectedOrder(found);
          setTrackingNumber(found.trackingNumber || "");
        }
      }
    } catch (err) {
      console.error("Failed to load admin orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleQuickStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const updated = await orderService.updateOrderStatus(orderId, { status: newStatus });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(updated);
      }
      showToast(`Order updated to ${newStatus}`, "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to update order status", "error");
    }
  };

  const handleUpdateTracking = async () => {
    if (!selectedOrder) return;
    try {
      setIsUpdatingTracking(true);
      const updated = await orderService.updateOrderStatus(selectedOrder._id, {
        status: selectedOrder.orderStatus === "pending" || selectedOrder.orderStatus === "confirmed" ? "shipped" : selectedOrder.orderStatus,
        trackingNumber: trackingNumber.trim(),
      });
      setSelectedOrder(updated);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      showToast("Courier tracking details attached", "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to attach tracking", "error");
    } finally {
      setIsUpdatingTracking(false);
    }
  };

  const handleVerifyBankPayment = async (isApproved: boolean) => {
    if (!selectedOrder) return;
    const reason = !isApproved ? prompt("Enter reason for receipt rejection:") : undefined;
    if (!isApproved && !reason) return;

    try {
      setIsVerifyingPayment(true);
      const updated = await orderService.verifyPayment(selectedOrder._id, isApproved, reason || undefined);
      setSelectedOrder(updated);
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      showToast(
        isApproved
          ? "Bank transfer payment approved & order confirmed"
          : "Bank transfer payment rejected",
        isApproved ? "success" : "info"
      );
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Payment verification failed", "error");
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-serif font-bold text-white">Order Fulfilment & Dispatch</h2>
        <p className="text-xs text-zinc-400">
          Monitor incoming purchases, inspect bank deposit slips, assign courier tracking numbers
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order #, customer name, or phone number..."
              className="pl-10 h-10 text-xs"
            />
          </div>
          <Button type="submit" size="sm" variant="outline" className="h-10 text-xs px-4">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Order Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-zinc-500 text-xs">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 text-xs">No orders matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px] bg-zinc-950/40">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Fulfilment Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      #{order.orderNumber}
                    </td>

                    <td className="py-3.5 px-3 text-zinc-400 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-medium text-zinc-200">
                        {order.shippingAddress?.fullName}
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        {order.shippingAddress?.phone}
                      </p>
                    </td>

                    <td className="py-3.5 px-3 font-serif font-bold text-gold-400">
                      {formatLKR(order.totalAmount)}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full capitalize text-[10px] font-semibold ${
                            order.paymentStatus === "paid"
                              ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                              : order.paymentStatus === "failed"
                              ? "bg-red-950/60 text-red-400 border border-red-500/30"
                              : "bg-amber-950/60 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                        <p className="text-[10px] text-zinc-400 capitalize">
                          {order.paymentMethod?.replace("_", " ")}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleQuickStatusChange(order._id, e.target.value)}
                        className="text-xs bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-gold-500 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedOrder(order);
                          setTrackingNumber(order.trackingNumber || "");
                        }}
                        className="text-gold-400 hover:text-gold-300 text-xs h-8"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        <span>Inspect</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-gold-500/30 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-white text-lg">
                    Order #{selectedOrder.orderNumber}
                  </h3>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-semibold ${
                      selectedOrder.orderStatus === "delivered"
                        ? "bg-emerald-950 text-emerald-400"
                        : "bg-amber-950 text-amber-400"
                    }`}
                  >
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-zinc-950 p-4 rounded-xl border border-zinc-800">
              <div className="space-y-1">
                <span className="font-semibold uppercase tracking-wider text-zinc-400 block">
                  Customer Contact
                </span>
                <p className="font-medium text-white">{selectedOrder.shippingAddress?.fullName}</p>
                <p className="text-zinc-300">Phone: {selectedOrder.shippingAddress?.phone}</p>
                {selectedOrder.user && typeof selectedOrder.user === "object" && (
                  <p className="text-zinc-400">Email: {(selectedOrder.user as any).email}</p>
                )}
              </div>

              <div className="space-y-1">
                <span className="font-semibold uppercase tracking-wider text-zinc-400 block">
                  Delivery Destination
                </span>
                <p className="text-zinc-300">{selectedOrder.shippingAddress?.addressLine1}</p>
                {selectedOrder.shippingAddress?.addressLine2 && (
                  <p className="text-zinc-300">{selectedOrder.shippingAddress?.addressLine2}</p>
                )}
                <p className="text-white font-medium">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.district}
                </p>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                Purchased Jewellery Items
              </span>
              <div className="divide-y divide-zinc-800 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden relative flex-shrink-0">
                        <SafeImage
                          src={item.image || "/images/placeholders/necklace.jpg"}
                          alt={item.name || item.title || "Jewellery"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{item.name || item.title}</p>
                        {item.variantName && (
                          <p className="text-[11px] text-gold-400">Variant: {item.variantName}</p>
                        )}
                        <p className="text-zinc-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-white">
                      {formatLKR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank Transfer Receipt Verification */}
            {selectedOrder.paymentMethod === "bank_transfer" && (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                  Bank Transfer Verification
                </span>

                {selectedOrder.bankReceiptUrl ? (
                  <div className="space-y-3">
                    <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950">
                      <SafeImage
                        src={selectedOrder.bankReceiptUrl}
                        alt="Bank Deposit Slip"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <a
                        href={selectedOrder.bankReceiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gold-400 hover:text-gold-300 underline flex items-center gap-1"
                      >
                        <span>Open receipt full size</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      {selectedOrder.paymentStatus !== "paid" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            disabled={isVerifyingPayment}
                            onClick={() => handleVerifyBankPayment(true)}
                            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Approve Payment
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isVerifyingPayment}
                            onClick={() => handleVerifyBankPayment(false)}
                            className="text-xs border-red-500/40 text-red-400 hover:bg-red-950/20"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400">
                    Customer selected Bank Transfer but has not yet uploaded a deposit slip.
                  </p>
                )}
              </div>
            )}

            {/* Courier Dispatch Tracking */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                Assign Registered Courier Tracking
              </span>
              <div className="flex gap-2">
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. PRONET-LK-89412 or DOMEX-78192"
                  className="text-xs h-9"
                />
                <Button
                  size="sm"
                  onClick={handleUpdateTracking}
                  disabled={isUpdatingTracking || !trackingNumber.trim()}
                  className="text-xs h-9 whitespace-nowrap"
                >
                  <Truck className="w-3.5 h-3.5 mr-1.5" />
                  Save Tracking
                </Button>
              </div>
            </div>

            {/* Pricing Total */}
            <div className="border-t border-zinc-800 pt-3 flex items-center justify-between">
              <span className="font-serif font-bold text-white text-base">Order Total:</span>
              <span className="font-serif font-bold text-gold-400 text-xl">
                {formatLKR(selectedOrder.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-zinc-500 text-xs">Loading orders...</div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}
