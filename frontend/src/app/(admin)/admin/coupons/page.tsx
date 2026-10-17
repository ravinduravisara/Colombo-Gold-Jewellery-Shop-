"use client";

import React, { useEffect, useState } from "react";
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Calendar,
  CheckCircle,
  X,
  Percent,
} from "lucide-react";
import { adminService, ICoupon } from "@/services/adminService";
import { formatLKR } from "@/lib/formatCurrency";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminCouponsPage() {
  const { showToast } = useUIStore();
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("10");
  const [minOrderLkr, setMinOrderLkr] = useState("5000");
  const [validUntil, setValidUntil] = useState("");
  const [usageLimit, setUsageLimit] = useState("100");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getCoupons();
      setCoupons(data || []);
    } catch (err) {
      console.error("Failed to load coupons:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const resetForm = () => {
    setCode("");
    setDescription("");
    setDiscountType("percentage");
    setDiscountValue("10");
    setMinOrderLkr("5000");
    setValidUntil("");
    setUsageLimit("100");
    setIsActive(true);
    setEditingId(null);
    setIsEditing(false);
  };

  const handleStartEdit = (coupon: ICoupon) => {
    setEditingId(coupon._id);
    setCode(coupon.code);
    setDescription(coupon.description || "");
    setDiscountType(coupon.discountType);
    setDiscountValue(
      coupon.discountType === "fixed"
        ? (coupon.discountValue / 100).toString()
        : coupon.discountValue.toString()
    );
    setMinOrderLkr(
      coupon.minOrderAmount ? (coupon.minOrderAmount / 100).toString() : ""
    );
    setValidUntil(coupon.validUntil ? coupon.validUntil.slice(0, 10) : "");
    setUsageLimit(coupon.usageLimit?.toString() || "");
    setIsActive(coupon.isActive);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return showToast("Coupon code is required", "error");

    try {
      setIsSaving(true);
      const rawVal = parseFloat(discountValue);
      const discountValMinor =
        discountType === "fixed" ? Math.round(rawVal * 100) : rawVal;

      const payload: Partial<ICoupon> = {
        code: code.trim().toUpperCase(),
        description: description.trim(),
        discountType,
        discountValue: discountValMinor,
        minOrderAmount: minOrderLkr ? Math.round(parseFloat(minOrderLkr) * 100) : undefined,
        validUntil: validUntil ? new Date(validUntil).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
        validFrom: new Date().toISOString(),
        usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
        isActive,
      };

      if (editingId) {
        await adminService.updateCoupon(editingId, payload);
        showToast("Coupon code updated", "success");
      } else {
        await adminService.createCoupon(payload);
        showToast("New promotional coupon activated", "success");
      }

      resetForm();
      fetchCoupons();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to save coupon", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, cCode: string) => {
    if (!confirm(`Are you sure you want to delete coupon code "${cCode}"?`)) return;
    try {
      await adminService.deleteCoupon(id);
      showToast(`Coupon "${cCode}" removed`, "success");
      fetchCoupons();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete coupon", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Coupons & Promotional Discounts</h2>
          <p className="text-xs text-zinc-400">
            Create discount promo codes for festival seasons, wedding campaigns, and influencer offers
          </p>
        </div>
        {!isEditing && (
          <Button
            size="sm"
            onClick={() => {
              resetForm();
              setIsEditing(true);
            }}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Promo Code</span>
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="bg-zinc-900/60 border border-gold-500/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-serif font-bold text-white text-base">
              {editingId ? "Edit Promo Code" : "Create New Coupon Code"}
            </h3>
            <button onClick={resetForm} className="text-zinc-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Coupon Code *
              </label>
              <Input
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SINHALA20"
                className="font-mono uppercase font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Discount Type *
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full h-11 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-gold-500"
              >
                <option value="percentage">Percentage Off (%)</option>
                <option value="fixed">Fixed LKR Amount (Rs.)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Discount Value *
              </label>
              <Input
                required
                type="number"
                min="1"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === "percentage" ? "10 for 10%" : "1500 for Rs.1,500"}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Min. Order Amount (LKR)
              </label>
              <Input
                type="number"
                min="0"
                value={minOrderLkr}
                onChange={(e) => setMinOrderLkr(e.target.value)}
                placeholder="e.g. 5000"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Expiry Date
              </label>
              <Input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Max Uses Limit
              </label>
              <Input
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                placeholder="e.g. 100"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Description / Campaign Note
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. New year 20% discount on 24K gold covering bangles"
              />
            </div>

            <div className="sm:col-span-3 flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="cpActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 accent-gold-500 rounded cursor-pointer"
              />
              <label htmlFor="cpActive" className="text-xs text-zinc-300 cursor-pointer">
                Coupon is Active and Redeemable at Checkout
              </label>
            </div>

            <div className="sm:col-span-3 flex gap-3 pt-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Coupon"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-zinc-500 text-xs">Loading coupon codes...</div>
        ) : coupons.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs">No coupons created yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px] bg-zinc-950/40">
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-3">Discount</th>
                  <th className="py-3 px-3">Min. Order</th>
                  <th className="py-3 px-3">Valid Until</th>
                  <th className="py-3 px-3">Redeemed</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-zinc-800/30">
                    <td className="py-3.5 px-4 font-mono font-bold text-gold-400 text-sm">
                      {c.code}
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-white">
                      {c.discountType === "percentage"
                        ? `${c.discountValue}% Off`
                        : `${formatLKR(c.discountValue)} Off`}
                    </td>

                    <td className="py-3.5 px-3 text-zinc-400">
                      {c.minOrderAmount ? formatLKR(c.minOrderAmount) : "None"}
                    </td>

                    <td className="py-3.5 px-3 text-zinc-400">
                      {c.validUntil
                        ? new Date(c.validUntil).toLocaleDateString()
                        : "No expiry"}
                    </td>

                    <td className="py-3.5 px-3 text-zinc-300">
                      {c.usedCount || 0}
                      {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          c.isActive
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {c.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStartEdit(c)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-gold-400 hover:bg-zinc-800"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id, c.code)}
                          className="p-1.5 rounded-lg text-red-400/80 hover:text-red-300 hover:bg-red-950/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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

