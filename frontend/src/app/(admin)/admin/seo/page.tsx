"use client";

import React, { useEffect, useState } from "react";
import { Search, Save, Globe, Sparkles } from "lucide-react";
import { settingsService } from "@/services/settingsService";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSeoPage() {
  const { showToast } = useUIStore();
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSeo() {
      try {
        setIsLoading(true);
        const settings = await settingsService.getAdminSettings();
        if (settings?.seo) {
          setMetaTitle(settings.seo.metaTitle || "");
          setMetaDescription(settings.seo.metaDescription || "");
          setKeywords(
            Array.isArray(settings.seo.metaKeywords)
              ? settings.seo.metaKeywords.join(", ")
              : ""
          );
        }
      } catch (err) {
        console.error("Failed to load SEO settings:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSeo();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const kwList = keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      await settingsService.updateSettings({
        seo: {
          metaTitle: metaTitle.trim(),
          metaDescription: metaDescription.trim(),
          metaKeywords: kwList,
        },
      });
      showToast("Global SEO metadata updated successfully", "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to update SEO", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-serif font-bold text-white">Search Engine Optimization (SEO)</h2>
        <p className="text-xs text-zinc-400">
          Optimize your Google search appearances, OpenGraph social shares, and Sri Lankan search keywords
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <form onSubmit={handleSave} className="md:col-span-2 space-y-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 sm:p-8">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Default Browser Title Template *
            </label>
            <Input
              required
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Colombo Gold Covering | Sri Lanka's Premier Gold-Plated Jewellery"
            />
            <span className="text-[11px] text-zinc-500">
              Optimal length: 50-60 characters ({metaTitle.length} chars)
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Meta Description *
            </label>
            <textarea
              rows={4}
              required
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Discover exquisite 24K gold-covered and gold-plated necklaces, bangles, and bridal sets in Sri Lanka..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white leading-relaxed focus:outline-none focus:border-gold-500"
            />
            <span className="text-[11px] text-zinc-500">
              Optimal length: 140-160 characters ({metaDescription.length} chars)
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Keywords (Comma-separated)
            </label>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="gold covering sri lanka, gold plated jewellery colombo, bridal necklace set"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={isSaving || isLoading} className="flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save SEO Settings"}</span>
            </Button>
          </div>
        </form>

        {/* Live Google Search Preview */}
        <div className="space-y-4">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
            Google Search Snippet Preview
          </span>
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Globe className="w-3.5 h-3.5 text-zinc-500" />
              <span className="truncate">https://colombogoldcovering.lk</span>
            </div>
            <h4 className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer line-clamp-1">
              {metaTitle || "Colombo Gold Covering | Sri Lanka"}
            </h4>
            <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
              {metaDescription || "Sri Lanka's leading gold-covered and gold-plated jewellery artisan."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

