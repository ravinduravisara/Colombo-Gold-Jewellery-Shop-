"use client";

import React, { useEffect, useState } from "react";
import {
  Settings,
  Save,
  MessageCircle,
  Building,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { settingsService } from "@/services/settingsService";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  const { showToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // General
  const [storeName, setStoreName] = useState("");
  const [tagline, setTagline] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [address, setAddress] = useState("");

  // Bank Account
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankInstructions, setBankInstructions] = useState("");

  // Payment Toggles
  const [enableCod, setEnableCod] = useState(true);
  const [enableBankTransfer, setEnableBankTransfer] = useState(true);
  const [enableDirectWhatsApp, setEnableDirectWhatsApp] = useState(true);

  // Announcement Bar
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        const data = await settingsService.getAdminSettings();
        if (data) {
          setStoreName(data.storeName || "");
          setTagline(data.tagline || "");
          setContactEmail(data.contactEmail || "");
          setContactPhone(data.contactPhone || "");
          setWhatsappNumber(data.whatsappNumber || "");
          setAddress(data.address || "");

          if (data.bankDetails) {
            setBankName(data.bankDetails.bankName || "");
            setBranchName(data.bankDetails.branchName || "");
            setAccountName(data.bankDetails.accountName || "");
            setAccountNumber(data.bankDetails.accountNumber || "");
            setBankInstructions(data.bankDetails.instructions || "");
          }

          setEnableCod(data.enableCod !== false);
          setEnableBankTransfer(data.enableBankTransfer !== false);
          setEnableDirectWhatsApp(data.enableDirectWhatsApp !== false);

          if (data.announcementBar) {
            setAnnouncementEnabled(data.announcementBar.enabled || false);
            setAnnouncementText(data.announcementBar.text || "");
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await settingsService.updateSettings({
        storeName: storeName.trim(),
        tagline: tagline.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        whatsappNumber: whatsappNumber.trim().replace(/[^0-9]/g, ""),
        address: address.trim(),
        bankDetails: {
          bankName: bankName.trim(),
          branchName: branchName.trim(),
          accountName: accountName.trim(),
          accountNumber: accountNumber.trim(),
          instructions: bankInstructions.trim(),
          isActive: true,
        },
        enableCod,
        enableBankTransfer,
        enableDirectWhatsApp,
        announcementBar: {
          enabled: announcementEnabled,
          text: announcementText.trim(),
        },
      });
      showToast("Store configuration settings saved successfully", "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to update settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center text-zinc-500 text-xs">
        Loading store settings...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Store Configuration & Business Details</h2>
          <p className="text-xs text-zinc-400">
            Manage showroom contact points, WhatsApp ordering number, and bank deposit coordinates
          </p>
        </div>
        <Button type="submit" disabled={isSaving} className="flex items-center gap-1.5">
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Settings"}</span>
        </Button>
      </div>

      {/* General Business Information */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="font-serif font-bold text-white text-base">Store Identity</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Store Brand Name *
            </label>
            <Input
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Tagline Slogan
            </label>
            <Input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Contact & WhatsApp */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="font-serif font-bold text-white text-base">
          Showroom & Customer Contacts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              WhatsApp Order Number *
            </label>
            <Input
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="e.g. 94771234567"
            />
            <span className="text-[11px] text-zinc-500">
              Format: 9477xxxxxxx (without + sign)
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Hotline Phone Number
            </label>
            <Input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+94 11 288 9000"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Customer Support Email
            </label>
            <Input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="info@colombogoldcovering.lk"
            />
          </div>

          <div className="space-y-1 sm:col-span-3">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Showroom Physical Address
            </label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="No. 142/B, High Level Road, Sri Jayawardenepura Kotte, Colombo, Sri Lanka"
            />
          </div>
        </div>
      </div>

      {/* Bank Account Wire Transfer Coordinates */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-gold-400" />
          <h3 className="font-serif font-bold text-white text-base">
            Bank Account Deposit Details (For Bank Transfer Orders)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Bank Name *
            </label>
            <Input
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Commercial Bank of Ceylon"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Branch Name
            </label>
            <Input
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              placeholder="Kotte Branch"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Account Holder Name *
            </label>
            <Input
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Colombo Gold Covering"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Account Number *
            </label>
            <Input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="1000289192"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Deposit Instructions (Shown on Checkout)
            </label>
            <Input
              value={bankInstructions}
              onChange={(e) => setBankInstructions(e.target.value)}
              placeholder="Please transfer the total amount and upload your deposit slip or transaction reference."
            />
          </div>
        </div>
      </div>

      {/* Payment Options Toggles */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="font-serif font-bold text-white text-base">Checkout Payment Options</h3>

        <div className="space-y-3">
          <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={enableCod}
              onChange={(e) => setEnableCod(e.target.checked)}
              className="w-4 h-4 accent-gold-500 rounded"
            />
            <span>Enable Cash On Delivery (Island-wide courier payment upon delivery)</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={enableBankTransfer}
              onChange={(e) => setEnableBankTransfer(e.target.checked)}
              className="w-4 h-4 accent-gold-500 rounded"
            />
            <span>Enable Direct Bank Transfer & Slip Verification</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={enableDirectWhatsApp}
              onChange={(e) => setEnableDirectWhatsApp(e.target.checked)}
              className="w-4 h-4 accent-gold-500 rounded"
            />
            <span>Enable Instant WhatsApp Ordering on Product Pages</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving} className="flex items-center gap-1.5">
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : "Save Settings"}</span>
        </Button>
      </div>
    </form>
  );
}

