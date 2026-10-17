"use client";

import React, { useEffect, useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import {
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  Video,
  Star,
  ExternalLink,
  X,
} from "lucide-react";
import { adminService, IGalleryItem } from "@/services/adminService";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminGalleryPage() {
  const { showToast } = useUIStore();
  const [items, setItems] = useState<IGalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [title, setTitle] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "tiktok_video" | "reel">("tiktok_video");
  const [mediaUrl, setMediaUrl] = useState("");
  const [externalUrl, setExternalUrl] = useState("https://www.tiktok.com/@colombogoldcovering");
  const [caption, setCaption] = useState("");
  const [isFeatured, setIsFeatured] = useState(true);
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchGallery = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getGallery();
      setItems(data || []);
    } catch (err) {
      console.error("Failed to load gallery:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const resetForm = () => {
    setTitle("");
    setMediaType("tiktok_video");
    setMediaUrl("");
    setExternalUrl("https://www.tiktok.com/@colombogoldcovering");
    setCaption("");
    setIsFeatured(true);
    setDisplayOrder("0");
    setIsActive(true);
    setEditingId(null);
    setIsEditing(false);
  };

  const handleStartEdit = (item: IGalleryItem) => {
    setEditingId(item._id);
    setTitle(item.title || "");
    const resolvedType = item.mediaType || ((item as any).type === "image" ? "image" : "tiktok_video");
    setMediaType(resolvedType as any);
    setMediaUrl(item.mediaUrl || "");
    setExternalUrl(item.externalUrl || item.mediaUrl || "https://www.tiktok.com/@colombogoldcovering");
    setCaption(item.caption || "");
    setIsFeatured(!!item.isFeatured);
    setDisplayOrder(item.displayOrder?.toString() || "0");
    setIsActive(item.isActive !== false);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return showToast("Title is required", "error");
    if (!mediaUrl.trim()) return showToast("Media URL is required", "error");

    try {
      setIsSaving(true);
      const payload: Partial<IGalleryItem> = {
        title: title.trim(),
        mediaType,
        mediaUrl: mediaUrl.trim(),
        externalUrl: externalUrl.trim() || undefined,
        caption: caption.trim() || undefined,
        isFeatured,
        displayOrder: parseInt(displayOrder) || 0,
        isActive,
      };

      if (editingId) {
        await adminService.updateGalleryItem(editingId, payload);
        showToast("Gallery showcase item updated", "success");
      } else {
        await adminService.createGalleryItem(payload);
        showToast("New media item added to showcase", "success");
      }

      resetForm();
      fetchGallery();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to save item", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, gTitle: string) => {
    if (!confirm(`Delete media item "${gTitle}"?`)) return;
    try {
      await adminService.deleteGalleryItem(id);
      showToast(`Showcase item "${gTitle}" deleted`, "success");
      fetchGallery();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete item", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">TikTok & Visual Media Showcase</h2>
          <p className="text-xs text-zinc-400">
            Showcase viral TikTok videos (@colombogoldcovering) and Instagram reels on the website
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
            <span>Add Media Post</span>
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="bg-zinc-900/60 border border-gold-500/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-serif font-bold text-white text-base">
              {editingId ? "Edit Showcase Item" : "New Media Showcase Item"}
            </h3>
            <button onClick={resetForm} className="text-zinc-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Post Title *
              </label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 24K Gold Plated Peacock Bangle Shimmering"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Media Format *
              </label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as any)}
                className="w-full h-11 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-gold-500"
              >
                <option value="tiktok_video">TikTok Video / Embed</option>
                <option value="reel">Instagram Reel</option>
                <option value="image">Still Photography Image</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Media Thumbnail / Image URL *
              </label>
              <Input
                required
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://... cover picture or thumbnail"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                External Video Link (TikTok / Instagram URL)
              </label>
              <Input
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://www.tiktok.com/@colombogoldcovering/video/..."
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Caption
              </label>
              <Input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Short video caption or customer comment"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-gold-500 rounded"
                />
                <span>Featured on Homepage</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-gold-500 rounded"
                />
                <span>Active & Published</span>
              </label>
            </div>

            <div className="sm:col-span-2 flex gap-3 pt-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Media Post"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {isLoading ? (
          <div className="col-span-3 py-12 text-center text-zinc-500 text-xs">Loading media gallery...</div>
        ) : items.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-zinc-500 text-xs">No media items configured yet.</div>
        ) : (
          items.map((item) => {
            const typeStr = item.mediaType || (item as any).type || "tiktok_video";
            const isVideo = typeStr.includes("tiktok") || typeStr.includes("video") || typeStr.includes("reel");
            const imageSrc =
              item.thumbnailUrl ||
              (item.mediaUrl && !item.mediaUrl.includes("tiktok.com")
                ? item.mediaUrl
                : "/images/placeholders/necklace.jpg");

            return (
              <div
                key={item._id}
                className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-gold-500/40 transition-all"
              >
                <div className="relative aspect-[9/12] w-full bg-zinc-950">
                  <SafeImage
                    src={imageSrc}
                    alt={item.title || "Jewellery piece"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-gold-300 text-[10px] font-semibold uppercase border border-zinc-700 flex items-center gap-1">
                      {isVideo ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                      <span>{typeStr.replace("_", " ")}</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-white text-sm line-clamp-1">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{item.caption}</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                    {item.externalUrl || item.mediaUrl ? (
                      <a
                        href={item.externalUrl || item.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Watch</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-zinc-500">Local</span>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-gold-400 hover:bg-zinc-800"
                        title="Edit item"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id, item.title)}
                        className="p-1.5 rounded-lg text-red-400/80 hover:text-red-300 hover:bg-red-950/30"
                        title="Delete item"
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

