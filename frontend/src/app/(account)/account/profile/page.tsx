"use client";

import React, { useState } from "react";
import { User, Phone, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { userService } from "@/services/userService";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const { showToast } = useUIStore();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setStatusMsg(null);
      const updatedUser = await userService.updateProfile({
        name: name.trim(),
        phone: phone.trim(),
      });
      if (updatedUser) {
        setUser(updatedUser);
      }
      setStatusMsg({ type: "success", text: "Your profile details have been successfully updated." });
      showToast("Profile updated successfully", "success");
    } catch (err: any) {
      const errText = err?.response?.data?.message || "Failed to update profile.";
      setStatusMsg({ type: "error", text: errText });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="text-xl font-serif font-bold text-white">Profile Details</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Manage your personal contact details used for orders and order updates.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
            statusMsg.type === "success"
              ? "bg-emerald-950/40 border border-emerald-500/40 text-emerald-300"
              : "bg-red-950/40 border border-red-500/40 text-red-300"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        {/* Email - Readonly */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Email Address (Non-editable)
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              type="email"
              disabled
              value={user?.email || ""}
              className="pl-10 opacity-60 cursor-not-allowed bg-zinc-950"
            />
          </div>
          <span className="text-[11px] text-zinc-500">
            To change your registered email, please contact customer support.
          </span>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priyantha Perera"
              className="pl-10"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Phone / WhatsApp Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="077 123 4567 or +94 77 123 4567"
              className="pl-10"
            />
          </div>
          <span className="text-[11px] text-zinc-500">
            Used for delivery updates and courier dispatch notifications.
          </span>
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? "Saving Changes..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}

