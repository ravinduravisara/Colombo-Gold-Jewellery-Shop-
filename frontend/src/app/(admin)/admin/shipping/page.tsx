"use client";

import React, { useEffect, useState } from "react";
import {
  Truck,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  MapPin,
} from "lucide-react";
import { adminService, IShippingZone } from "@/services/adminService";
import { formatLKR } from "@/lib/formatCurrency";
import { SRI_LANKAN_DISTRICTS } from "@/lib/constants";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminShippingPage() {
  const { showToast } = useUIStore();
  const [zones, setZones] = useState<IShippingZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [name, setName] = useState("");
  const [baseRateLkr, setBaseRateLkr] = useState("350");
  const [deliveryDays, setDeliveryDays] = useState("1-3 Business Days");
  const [freeThresholdLkr, setFreeThresholdLkr] = useState("10000");
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchZones = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getShippingZones();
      setZones(data || []);
    } catch (err) {
      console.error("Failed to load shipping zones:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const resetForm = () => {
    setName("");
    setBaseRateLkr("350");
    setDeliveryDays("1-3 Business Days");
    setFreeThresholdLkr("10000");
    setSelectedDistricts([]);
    setIsActive(true);
    setEditingId(null);
    setIsEditing(false);
  };

  const handleStartEdit = (zone: IShippingZone) => {
    setEditingId(zone._id);
    setName(zone.name);
    setBaseRateLkr((zone.baseRate / 100).toString());
    setDeliveryDays(zone.estimatedDeliveryDays);
    setFreeThresholdLkr(
      zone.freeShippingThreshold ? (zone.freeShippingThreshold / 100).toString() : ""
    );
    setSelectedDistricts(zone.districts || []);
    setIsActive(zone.isActive);
    setIsEditing(true);
  };

  const toggleDistrict = (d: string) => {
    setSelectedDistricts((prev) =>
      prev.includes(d) ? prev.filter((item) => item !== d) : [...prev, d]
    );
  };

  const selectAllDistricts = () => {
    setSelectedDistricts([...SRI_LANKAN_DISTRICTS]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return showToast("Zone name is required", "error");
    if (selectedDistricts.length === 0) {
      return showToast("Please select at least one district for this zone", "error");
    }

    try {
      setIsSaving(true);
      const payload: Partial<IShippingZone> = {
        name: name.trim(),
        baseRate: Math.round(parseFloat(baseRateLkr) * 100),
        estimatedDeliveryDays: deliveryDays.trim(),
        freeShippingThreshold: freeThresholdLkr
          ? Math.round(parseFloat(freeThresholdLkr) * 100)
          : undefined,
        districts: selectedDistricts,
        isActive,
      };

      if (editingId) {
        await adminService.updateShippingZone(editingId, payload);
        showToast("Shipping zone updated", "success");
      } else {
        await adminService.createShippingZone(payload);
        showToast("New shipping zone configured", "success");
      }

      resetForm();
      fetchZones();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to save shipping zone", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, zoneName: string) => {
    if (!confirm(`Are you sure you want to delete zone "${zoneName}"?`)) return;
    try {
      await adminService.deleteShippingZone(id);
      showToast(`Shipping zone "${zoneName}" deleted`, "success");
      fetchZones();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete zone", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Delivery Charges & Shipping Zones</h2>
          <p className="text-xs text-zinc-400">
            Configure courier rates and free-shipping thresholds for all 25 Sri Lankan administrative districts
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
            <span>Add Shipping Zone</span>
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="bg-zinc-900/60 border border-gold-500/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-serif font-bold text-white text-base">
              {editingId ? "Edit Delivery Zone" : "New Delivery Zone"}
            </h3>
            <button onClick={resetForm} className="text-zinc-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Zone Title *
              </label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Western Province Express"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Base Courier Rate (LKR) *
              </label>
              <Input
                required
                type="number"
                min="0"
                value={baseRateLkr}
                onChange={(e) => setBaseRateLkr(e.target.value)}
                placeholder="e.g. 350"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Estimated Delivery Window *
              </label>
              <Input
                required
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value)}
                placeholder="e.g. 1-2 Business Days"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Free Delivery Order Threshold (LKR)
              </label>
              <Input
                type="number"
                min="0"
                value={freeThresholdLkr}
                onChange={(e) => setFreeThresholdLkr(e.target.value)}
                placeholder="e.g. 10000 (Orders above this amount ship for free)"
              />
            </div>

            <div className="space-y-1 flex items-center pt-5">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-gold-500 rounded"
                />
                <span>Active Shipping Method</span>
              </label>
            </div>

            {/* Districts Selector */}
            <div className="sm:col-span-3 space-y-2 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Assigned Districts ({selectedDistricts.length} selected) *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllDistricts}
                    className="text-[11px] text-gold-400 hover:underline"
                  >
                    Select All 25 Districts
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setSelectedDistricts([])}
                    className="text-[11px] text-zinc-400 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                {SRI_LANKAN_DISTRICTS.map((district) => {
                  const isChecked = selectedDistricts.includes(district);
                  return (
                    <label
                      key={district}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? "bg-gold-500/20 text-gold-300 border border-gold-500/30"
                          : "text-zinc-400 hover:bg-zinc-900"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleDistrict(district)}
                        className="hidden"
                      />
                      <span>{district}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="sm:col-span-3 flex gap-3 pt-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Delivery Zone"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isLoading ? (
          <div className="col-span-2 py-12 text-center text-zinc-500 text-xs">Loading shipping zones...</div>
        ) : zones.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-zinc-500 text-xs">No delivery zones created yet.</div>
        ) : (
          zones.map((zone) => (
            <div
              key={zone._id}
              className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4 hover:border-gold-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-gold-400" />
                    <h3 className="font-serif font-bold text-white text-base">{zone.name}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      zone.isActive
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {zone.isActive ? "Active" : "Disabled"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Base Rate</span>
                    <span className="font-serif font-bold text-gold-400 text-sm">
                      {formatLKR(zone.baseRate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Transit Time</span>
                    <span className="text-zinc-200 font-medium">{zone.estimatedDeliveryDays}</span>
                  </div>
                  {zone.freeShippingThreshold && (
                    <div className="col-span-2 pt-1 border-t border-zinc-800 text-emerald-400 text-[11px]">
                      Free shipping on orders above {formatLKR(zone.freeShippingThreshold)}
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
                    Coverage ({zone.districts?.length || 0} Districts)
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {zone.districts?.map((d) => (
                      <span
                        key={d}
                        className="px-2 py-0.5 rounded-md bg-zinc-800 text-[11px] text-zinc-300"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-end gap-2 text-xs">
                <button
                  onClick={() => handleStartEdit(zone)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-gold-400 hover:bg-zinc-800"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(zone._id, zone.name)}
                  className="p-1.5 rounded-lg text-red-400/80 hover:text-red-300 hover:bg-red-950/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

