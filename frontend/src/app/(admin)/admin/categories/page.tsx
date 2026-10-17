"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Layers,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { categoryService } from "@/services/categoryService";
import { ICategory } from "@/types/product";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SafeImage } from "@/components/ui/SafeImage";

export default function AdminCategoriesPage() {
  const { showToast } = useUIStore();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoryService.getCategories(true);
      setCategories(data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("");
    setDisplayOrder("0");
    setIsActive(true);
    setEditingId(null);
    setIsEditing(false);
  };

  const handleStartEdit = (cat: ICategory) => {
    setEditingId(cat._id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setImageUrl(cat.image || "");
    setDisplayOrder(cat.displayOrder?.toString() || "0");
    setIsActive(cat.isActive);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return showToast("Category name is required", "error");

    try {
      setIsSaving(true);
      const payload: Partial<ICategory> = {
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: description.trim(),
        image: imageUrl.trim() || undefined,
        displayOrder: parseInt(displayOrder) || 0,
        isActive,
      };

      if (editingId) {
        await categoryService.updateCategory(editingId, payload);
        showToast("Category updated successfully", "success");
      } else {
        await categoryService.createCategory(payload);
        showToast("Category created successfully", "success");
      }

      resetForm();
      fetchCategories();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to save category", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete "${catName}"?`)) return;
    try {
      await categoryService.deleteCategory(id);
      showToast(`Category "${catName}" removed`, "success");
      fetchCategories();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete category", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Jewellery Categories</h2>
          <p className="text-xs text-zinc-400">
            Organize necklaces, bangles, rings, and sets for storefront browsing
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
            <span>Add Category</span>
          </Button>
        )}
      </div>

      {/* Inline Form */}
      {isEditing && (
        <div className="bg-zinc-900/60 border border-gold-500/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-serif font-bold text-white text-base">
              {editingId ? "Edit Jewellery Category" : "New Jewellery Category"}
            </h3>
            <button onClick={resetForm} className="text-zinc-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Category Name *
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
                placeholder="e.g. Bridal Necklaces"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Slug
              </label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. bridal-necklaces"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Description
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description for category banner and SEO"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Image URL
              </label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
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

            <div className="sm:col-span-2 flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="catActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 accent-gold-500 rounded cursor-pointer"
              />
              <label htmlFor="catActive" className="text-xs text-zinc-300 cursor-pointer">
                Active & Visible on Storefront
              </label>
            </div>

            <div className="sm:col-span-2 flex gap-3 pt-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Category"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-zinc-500 text-xs">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Layers className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 text-xs">No categories created yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px] bg-zinc-950/40">
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-3">Slug</th>
                  <th className="py-3 px-3">Display Order</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden relative flex-shrink-0">
                          <SafeImage
                            src={cat.image || "/images/placeholders/necklace.jpg"}
                            alt={cat.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{cat.name}</p>
                          {cat.description && (
                            <p className="text-[11px] text-zinc-400 line-clamp-1">
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-zinc-400">/{cat.slug}</td>

                    <td className="py-3.5 px-3 text-zinc-300 font-medium">
                      {cat.displayOrder || 0}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          cat.isActive
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {cat.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStartEdit(cat)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-gold-400 hover:bg-zinc-800"
                          title="Edit Category"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className="p-1.5 rounded-lg text-red-400/80 hover:text-red-300 hover:bg-red-950/30"
                          title="Delete Category"
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

