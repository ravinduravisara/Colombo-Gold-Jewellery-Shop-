"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Edit,
  Save,
  CheckCircle,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { adminService, IContentPage } from "@/services/adminService";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminPagesPage() {
  const { showToast } = useUIStore();
  const [pages, setPages] = useState<IContentPage[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("about");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form
  const [title, setTitle] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [content, setContent] = useState("");

  const fetchPages = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getContentPages();
      setPages(data || []);
      const current = data?.find((p) => p.slug === selectedSlug) || data?.[0];
      if (current) {
        setSelectedSlug(current.slug);
        setTitle(current.title);
        setMetaTitle(current.metaTitle || "");
        setMetaDescription(current.metaDescription || "");
        setContent(current.content);
      }
    } catch (err) {
      console.error("Failed to load CMS pages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleSelectPage = (slug: string) => {
    setSelectedSlug(slug);
    const p = pages.find((page) => page.slug === slug);
    if (p) {
      setTitle(p.title);
      setMetaTitle(p.metaTitle || "");
      setMetaDescription(p.metaDescription || "");
      setContent(p.content);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updated = await adminService.updateContentPage(selectedSlug, {
        title: title.trim(),
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
        content: content.trim(),
      });
      setPages((prev) =>
        prev.map((p) => (p.slug === selectedSlug ? updated : p))
      );
      showToast(`Page "${title}" saved successfully`, "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to update page content", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Public Content & CMS Pages</h2>
          <p className="text-xs text-zinc-400">
            Edit brand stories, warranty promises, customer privacy policies, and terms without source code edits
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 block px-2">
            Available Pages
          </span>
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-3 space-y-1">
            {pages.map((p) => {
              const isActive = p.slug === selectedSlug;
              return (
                <button
                  key={p.slug}
                  onClick={() => handleSelectPage(p.slug)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                    isActive
                      ? "bg-gold-500/15 text-gold-400 border border-gold-500/30 font-semibold"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4" />
                    <span>{p.title}</span>
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="font-serif font-bold text-white text-base">
                  Editing: {title || selectedSlug}
                </h3>
                <p className="text-xs text-zinc-400">
                  Target Route: {selectedSlug === "about-us" ? "/about" : `/${selectedSlug}`}
                </p>
              </div>

              <Link
                href={selectedSlug === "about-us" ? "/about" : `/${selectedSlug}`}
                target="_blank"
                className="text-xs text-gold-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Preview Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Page Display Heading *
                </label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    SEO Meta Title
                  </label>
                  <Input
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Colombo Gold Covering | Lifetime Warranty"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    SEO Meta Description
                  </label>
                  <Input
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Concise search engine description"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Page Body Content (Markdown / Text) *
                </label>
                <textarea
                  rows={14}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-mono leading-relaxed focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" disabled={isSaving} className="flex items-center gap-1.5">
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Saving..." : "Save Page Content"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

