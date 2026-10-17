"use client";

import React, { useEffect, useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import {
  Plus,
  Edit,
  Trash2,
  FolderTree,
  Star,
  X,
  ExternalLink,
} from "lucide-react";
import { categoryService } from "@/services/categoryService";
import { ICollection } from "@/types/product";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminCollectionsPage() {
  const { showToast } = useUIStore();
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isFeatured, setIsFeatured] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const data = await categoryService.getCollections(true);
      setCollections(data || []);
    } catch (err) {
      console.error("Failed to load collections:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setBannerImage("");
    setDisplayOrder("0");
    setIsFeatured(true);
    setIsActive(true);
    setEditingId(null);
    setIsEditing(false);
  };

  const handleStartEdit = (col: ICollection) => {
    setEditingId(col._id);
    setName(col.name);
    setSlug(col.slug);
    setDescription(col.description || "");
    setBannerImage(col.bannerImage || "");
    setDisplayOrder(col.displayOrder?.toString() || "0");
    setIsFeatured(col.isFeatured);
    setIsActive(col.isActive);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return showToast("Collection name is required", "error");

    try {
      setIsSaving(true);
      const payload: Partial<ICollection> = {
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: description.trim(),
        bannerImage: bannerImage.trim() || undefined,
        displayOrder: parseInt(displayOrder) || 0,
        isFeatured,
        isActive,
      };

      if (editingId) {
        await categoryService.updateCollection(editingId, payload);
        showToast("Collection updated", "success");
      } else {
        await categoryService.createCollection(payload);
        showToast("Collection created", "success");
      }

      resetForm();
      fetchCollections();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to save collection", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, colName: string) => {
    if (!confirm(`Are you sure you want to delete collection "${colName}"?`)) return;
    try {
      await categoryService.deleteCollection(id);
      showToast(`Collection "${colName}" deleted`, "success");
      fetchCollections();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete collection", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Curated Collections</h2>
          <p className="text-xs text-zinc-400">
            Create featured collections (Bridal, Festive, Heritage, Daily Wear)
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
            <span>Add Collection</span>
          </Button>
        )}
      </div>

      {/* Inline Form */}
      {isEditing && (
        <div className="bg-zinc-900/60 border border-gold-500/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-serif font-bold text-white text-base">
              {editingId ? "Edit Collection" : "New Collection"}
            </h3>
            <button onClick={resetForm} className="text-zinc-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Collection Name *
              </label>
              <Input
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingId && !slug) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }
                }}
                placeholder="e.g. Royal Bridal Set 2026"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Slug
              </label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. royal-bridal-set-2026"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Description
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Collection narrative and background"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Banner Image URL
              </label>
              <Input
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                placeholder="https://... or /images/..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Display Order
              </label>
              <Input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
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
                <span>Feature on Homepage Banner</span>
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
                {isSaving ? "Saving..." : "Save Collection"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Collections Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {isLoading ? (
          <div className="col-span-3 py-12 text-center text-zinc-500 text-xs">
            Loading collections...
          </div>
        ) : collections.length === 0 ? (
          <div className="col-span-3 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-12 text-center space-y-3">
            <FolderTree className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 text-xs">No collections configured yet.</p>
          </div>
        ) : (
          collections.map((col) => (
            <div
              key={col._id}
              className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-gold-500/40 transition-all"
            >
              <div className="relative aspect-[16/9] w-full bg-zinc-950">
                <SafeImage
                  src={col.bannerImage || "/images/placeholders/necklace.jpg"}
                  alt={col.name}
                  fill
                  className="object-cover"
                />
                {col.isFeatured && (
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-gold-500 text-zinc-950 text-[10px] font-bold uppercase flex items-center gap-1 shadow">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Featured</span>
                  </span>
                )}
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-white text-base">{col.name}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                    {col.description || "Curated jewellery selection."}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-mono">/{col.slug}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(col)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-gold-400 hover:bg-zinc-800"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(col._id, col.name)}
                      className="p-1.5 rounded-lg text-red-400/80 hover:text-red-300 hover:bg-red-950/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

