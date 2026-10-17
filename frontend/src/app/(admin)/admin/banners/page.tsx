"use client";

import React, { useEffect, useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import {
  Sliders,
  Plus,
  Edit,
  Trash2,
  Upload,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { adminService, IBanner } from "@/services/adminService";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminBannersPage() {
  const { showToast } = useUIStore();
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("/shop");
  const [position, setPosition] = useState<"home-hero" | "collection-banner" | "promo-strip">("home-hero");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getBanners();
      setBanners(data || []);
    } catch (err) {
      console.error("Failed to load banners:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setImageUrl("");
    setLinkUrl("/shop");
    setPosition("home-hero");
    setDisplayOrder("0");
    setIsActive(true);
    setEditingId(null);
    setIsEditing(false);
  };

  const handleStartEdit = (b: IBanner) => {
    setEditingId(b._id);
    setTitle(b.title);
    setSubtitle(b.subtitle || "");
    setImageUrl(b.imageUrl);
    setLinkUrl(b.linkUrl || "/shop");
    setPosition(b.position);
    setDisplayOrder(b.displayOrder?.toString() || "0");
    setIsActive(b.isActive);
    setIsEditing(true);
  };

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const res = await adminService.uploadBannerImage(file);
      if (res?.url) {
        setImageUrl(res.url);
        showToast("Banner image uploaded successfully", "success");
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Upload failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return showToast("Banner title is required", "error");
    if (!imageUrl.trim()) return showToast("Banner image URL is required", "error");

    try {
      setIsSaving(true);
      const payload: Partial<IBanner> = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        imageUrl: imageUrl.trim(),
        linkUrl: linkUrl.trim(),
        position,
        displayOrder: parseInt(displayOrder) || 0,
        isActive,
      };

      if (editingId) {
        await adminService.updateBanner(editingId, payload);
        showToast("Banner updated", "success");
      } else {
        await adminService.createBanner(payload);
        showToast("Banner added to storefront", "success");
      }

      resetForm();
      fetchBanners();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to save banner", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, bTitle: string) => {
    if (!confirm(`Delete banner "${bTitle}"?`)) return;
    try {
      await adminService.deleteBanner(id);
      showToast(`Banner "${bTitle}" deleted`, "success");
      fetchBanners();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete banner", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Homepage & Promotional Banners</h2>
          <p className="text-xs text-zinc-400">
            Control the luxury homepage sliders, seasonal discount banners, and promo strips
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
            <span>Add Banner</span>
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="bg-zinc-900/60 border border-gold-500/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-serif font-bold text-white text-base">
              {editingId ? "Edit Banner" : "New Promotional Banner"}
            </h3>
            <button onClick={resetForm} className="text-zinc-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Headline Title *
              </label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Royal Wedding Collection 2026"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Subtitle Tagline
              </label>
              <Input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Pure 24K Micro Gold Covering with Lifetime Warranty"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Destination Link URL
              </label>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="e.g. /shop or /collections/bridal-elegance"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Banner Position
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as any)}
                className="w-full h-11 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-gold-500"
              >
                <option value="home-hero">Homepage Hero Carousel</option>
                <option value="collection-banner">Featured Collection Mid-banner</option>
                <option value="promo-strip">Top Promo Announcement Strip</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Banner Image *
              </label>
              <div className="flex gap-2">
                <Input
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or upload below"
                  className="flex-1"
                />
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUpload(f);
                    }}
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                    className="pointer-events-none text-xs"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1" />
                    <span>{isUploading ? "Uploading..." : "Upload File"}</span>
                  </Button>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Display Order Sequence
              </label>
              <Input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-gold-500 rounded"
                />
                <span>Active on Public Website</span>
              </label>
            </div>

            <div className="sm:col-span-2 flex gap-3 pt-2">
              <Button type="submit" disabled={isSaving || isUploading}>
                {isSaving ? "Saving..." : "Save Banner"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isLoading ? (
          <div className="col-span-2 py-12 text-center text-zinc-500 text-xs">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-zinc-500 text-xs">No banners added yet.</div>
        ) : (
          banners.map((b) => {
            const bannerImg = b.imageUrl || "/images/placeholders/necklace.jpg";
            return (
              <div
                key={b._id}
                className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-gold-500/40 transition-all"
              >
                <div className="relative aspect-[21/9] w-full bg-zinc-950">
                  <SafeImage src={bannerImg} alt={b.title || "Banner"} fill className="object-cover" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-gold-300 text-[10px] uppercase font-semibold border border-zinc-700">
                    {b.position?.replace("-", " ") || "banner"}
                  </span>
                </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-white text-base">{b.title}</h3>
                  {b.subtitle && <p className="text-xs text-zinc-400 mt-0.5">{b.subtitle}</p>}
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Order: {b.displayOrder}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(b)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-gold-400 hover:bg-zinc-800"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(b._id, b.title)}
                      className="p-1.5 rounded-lg text-red-400/80 hover:text-red-300 hover:bg-red-950/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
}

