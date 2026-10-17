"use client";

import React, { useState } from "react";
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Check,
  Star,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { userService } from "@/services/userService";
import { useUIStore } from "@/store/uiStore";
import { IAddress } from "@/types/user";
import { SRI_LANKAN_DISTRICTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddressesPage() {
  const { user, setUser } = useAuthStore();
  const { showToast } = useUIStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState(SRI_LANKAN_DISTRICTS[0] as string);
  const [postalCode, setPostalCode] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const resetForm = () => {
    setFullName(user?.name || "");
    setPhone(user?.phone || "");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setDistrict(SRI_LANKAN_DISTRICTS[0]);
    setPostalCode("");
    setIsDefault(false);
    setEditingAddressId(null);
    setIsEditing(false);
  };

  const startEdit = (address: IAddress) => {
    setEditingAddressId(address._id || null);
    setFullName(address.fullName);
    setPhone(address.phone);
    setAddressLine1(address.addressLine1);
    setAddressLine2(address.addressLine2 || "");
    setCity(address.city);
    setDistrict(address.district);
    setPostalCode(address.postalCode || "");
    setIsDefault(address.isDefault || false);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const payload = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim() || undefined,
        city: city.trim(),
        district,
        postalCode: postalCode.trim() || undefined,
        isDefault,
      };

      let updatedAddresses: IAddress[] | undefined;
      if (editingAddressId) {
        updatedAddresses = await userService.updateAddress(editingAddressId, payload);
      } else {
        updatedAddresses = await userService.addAddress(payload);
      }

      if (user && updatedAddresses) {
        setUser({ ...user, addresses: updatedAddresses });
      }
      showToast(
        editingAddressId ? "Address updated successfully" : "New address added",
        "success"
      );
      resetForm();
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Failed to save delivery address",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to remove this delivery address?")) return;
    try {
      setIsLoading(true);
      const updatedAddresses = await userService.deleteAddress(addressId);
      if (user && updatedAddresses) {
        setUser({ ...user, addresses: updatedAddresses });
      }
      showToast("Address removed", "success");
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Failed to delete address",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (address: IAddress) => {
    if (!address._id) return;
    try {
      setIsLoading(true);
      const updatedAddresses = await userService.updateAddress(address._id, {
        isDefault: true,
      });
      if (user && updatedAddresses) {
        setUser({ ...user, addresses: updatedAddresses });
      }
      showToast("Default address updated", "success");
    } catch (err: any) {
      showToast("Failed to set default address", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const addresses = user?.addresses || [];

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Delivery Addresses</h2>
          <p className="text-xs text-zinc-400">
            Save multiple addresses for rapid courier delivery across all 25 districts.
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => {
              resetForm();
              setIsEditing(true);
            }}
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="bg-zinc-900/60 border border-gold-500/40 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h3 className="font-serif font-bold text-white text-lg">
              {editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
            </h3>
            <Button variant="ghost" size="sm" onClick={resetForm}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Full Name *
              </label>
              <Input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Recipient's Name"
              />
            </div>

            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Phone Number *
              </label>
              <Input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="077 123 4567"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Address Line 1 *
              </label>
              <Input
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="Street address, building, suite"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Address Line 2 (Optional)
              </label>
              <Input
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Apartment, unit, floor, landmark"
              />
            </div>

            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                City / Town *
              </label>
              <Input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Nugegoda / Kotte"
              />
            </div>

            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                District *
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full h-11 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:outline-none focus:border-gold-500"
              >
                {SRI_LANKAN_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Postal Code (Optional)
              </label>
              <Input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="e.g. 10100"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="w-4 h-4 accent-gold-500 rounded cursor-pointer"
              />
              <label
                htmlFor="isDefault"
                className="text-xs text-zinc-300 cursor-pointer select-none"
              >
                Set as my default shipping address for rapid checkout
              </label>
            </div>

            <div className="sm:col-span-2 pt-4 flex gap-3">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Delivery Address"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.length === 0 && !isEditing ? (
          <div className="col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-10 text-center space-y-3">
            <MapPin className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 text-sm">No saved delivery addresses yet.</p>
            <Button
              onClick={() => {
                resetForm();
                setIsEditing(true);
              }}
              size="sm"
            >
              Add First Address
            </Button>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address._id}
              className={`bg-zinc-900/40 border rounded-2xl p-5 relative flex flex-col justify-between gap-4 transition-all ${
                address.isDefault
                  ? "border-gold-500/60 shadow-md bg-gold-950/10"
                  : "border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-base">
                      {address.fullName}
                    </span>
                    {address.isDefault && (
                      <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30">
                        Default
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm text-zinc-300 space-y-0.5">
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {address.city}, {address.district}{" "}
                    {address.postalCode ? `- ${address.postalCode}` : ""}
                  </p>
                  <p className="text-xs text-zinc-400 pt-1">
                    Phone: {address.phone}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                {!address.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(address)}
                    className="text-zinc-400 hover:text-gold-400 font-medium inline-flex items-center gap-1"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>Set as default</span>
                  </button>
                ) : (
                  <span className="text-gold-400 inline-flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>Primary Address</span>
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(address)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                    title="Edit address"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => address._id && handleDelete(address._id)}
                    className="p-1.5 rounded-lg text-red-400/80 hover:text-red-300 hover:bg-red-950/40"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

