"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Boxes,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Plus,
  Package,
  History,
  CheckCircle,
} from "lucide-react";
import { adminService, IInventoryStatus, IInventoryMovement } from "@/services/adminService";
import { productService } from "@/services/productService";
import { IProduct } from "@/types/product";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminInventoryPage() {
  const { showToast } = useUIStore();
  const [status, setStatus] = useState<IInventoryStatus | null>(null);
  const [movements, setMovements] = useState<IInventoryMovement[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Adjustment Modal
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [adjustmentQty, setAdjustmentQty] = useState("1");
  const [adjustmentType, setAdjustmentType] = useState<"in" | "out" | "adjustment">("in");
  const [reason, setReason] = useState("Showroom Restock");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [invStatus, movData, prodData] = await Promise.all([
        adminService.getInventoryStatus(),
        adminService.getInventoryMovements(1),
        productService.getProducts({ all: true, limit: 100 }),
      ]);
      setStatus(invStatus);
      setMovements(movData.movements || []);
      setProducts(prodData.products || []);
      if (!selectedProductId && prodData.products?.length > 0) {
        setSelectedProductId(prodData.products[0]._id);
      }
    } catch (err) {
      console.error("Failed to load inventory data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return showToast("Please select a product", "error");

    const qty = parseInt(adjustmentQty);
    if (isNaN(qty) || qty <= 0) return showToast("Quantity must be greater than zero", "error");

    try {
      setIsSubmitting(true);
      await adminService.adjustInventory({
        productId: selectedProductId,
        adjustment: adjustmentType === "out" ? -qty : qty,
        reason: reason.trim(),
        type: adjustmentType,
      });
      showToast("Inventory adjusted successfully", "success");
      setIsAdjusting(false);
      setAdjustmentQty("1");
      loadData();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to adjust inventory", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Stock & Inventory Management</h2>
          <p className="text-xs text-zinc-400">
            Real-time stock audits, threshold alerts, and showroom movement tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={loadData}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAdjusting(true)}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Adjust Stock</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
            Tracked Catalogue Items
          </span>
          <p className="text-2xl font-serif font-bold text-white mt-2">
            {status?.totalProducts || 0}
          </p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
            Active Variants
          </span>
          <p className="text-2xl font-serif font-bold text-white mt-2">
            {status?.totalTrackedVariants || 0}
          </p>
        </div>

        <div className="bg-zinc-900/40 border border-amber-500/30 rounded-2xl p-5">
          <span className="text-xs uppercase tracking-wider text-amber-400 font-medium">
            Low Stock Alerts
          </span>
          <p className="text-2xl font-serif font-bold text-amber-300 mt-2">
            {status?.lowStockCount || 0}
          </p>
        </div>

        <div className="bg-zinc-900/40 border border-red-500/30 rounded-2xl p-5">
          <span className="text-xs uppercase tracking-wider text-red-400 font-medium">
            Out of Stock Items
          </span>
          <p className="text-2xl font-serif font-bold text-red-400 mt-2">
            {status?.outOfStockCount || 0}
          </p>
        </div>
      </div>

      {/* Adjustment Modal / Drawer */}
      {isAdjusting && (
        <div className="bg-zinc-900/60 border border-gold-500/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-serif font-bold text-white text-base">Adjust Product Stock</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsAdjusting(false)}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleAdjustStock} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Select Jewellery Piece *
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-gold-500"
              >
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.sku}) — Current Stock: {p.stockQuantity}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Adjustment Type *
              </label>
              <select
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value as any)}
                className="w-full h-11 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-gold-500"
              >
                <option value="in">Stock In (Addition / Workshop delivery)</option>
                <option value="out">Stock Out (Deduction / Showroom walk-in sale)</option>
                <option value="adjustment">Audit Recalibration</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Quantity Units *
              </label>
              <Input
                type="number"
                min="1"
                required
                value={adjustmentQty}
                onChange={(e) => setAdjustmentQty(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Reason / Memo *
              </label>
              <Input
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Received new 24K gold covering batch from Kotte workshop"
              />
            </div>

            <div className="sm:col-span-2 flex gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Commit Stock Adjustment"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAdjusting(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Low Stock Items Section */}
      {status?.lowStockItems && status.lowStockItems.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-serif font-bold text-white text-base">
              Urgent Low Stock Restock Needed ({status.lowStockItems.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-amber-500/20 text-zinc-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Remaining Stock</th>
                  <th className="py-2.5 px-3">Threshold</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-500/10">
                {status.lowStockItems.map((item) => (
                  <tr key={item._id}>
                    <td className="py-2.5 px-3 font-semibold text-white">
                      {item.productTitle}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-zinc-400">{item.sku}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-400">
                      {item.stockQuantity} units left
                    </td>
                    <td className="py-2.5 px-3 text-zinc-500">{item.lowStockThreshold}</td>
                    <td className="py-2.5 px-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedProductId(item._id);
                          setAdjustmentType("in");
                          setAdjustmentQty("10");
                          setIsAdjusting(true);
                        }}
                        className="text-xs h-7 border-amber-500/40 text-amber-300"
                      >
                        Restock Now
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Movement History Log */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-gold-400" />
          <h3 className="font-serif font-bold text-white text-base">Stock Movement Audit Trail</h3>
        </div>

        {movements.length === 0 ? (
          <p className="text-zinc-500 text-xs py-6 text-center">No stock movements recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px] bg-zinc-950/40">
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Jewellery Item</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Qty</th>
                  <th className="py-3 px-3">Previous → New</th>
                  <th className="py-3 px-3">Reason / Memo</th>
                  <th className="py-3 px-3 text-right">Staff User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {movements.map((m) => (
                  <tr key={m._id} className="hover:bg-zinc-800/30">
                    <td className="py-3 px-3 text-zinc-400">
                      {new Date(m.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-3 font-medium text-white">{m.product?.name}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          m.type === "in"
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-950/60 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {m.type === "in" ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        <span className="capitalize">{m.type}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-white">
                      {m.type === "in" ? `+${m.quantity}` : `-${m.quantity}`}
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-400">
                      {m.previousStock} → {m.newStock}
                    </td>
                    <td className="py-3 px-3 text-zinc-300">{m.reason}</td>
                    <td className="py-3 px-3 text-right text-zinc-400">
                      {m.performedBy?.name || "System"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

