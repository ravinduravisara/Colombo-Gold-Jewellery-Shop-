"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/SafeImage";

export function CollectionBanner() {
  return (
    <section className="py-16 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Banner 1: Bridal Elegance */}
          <div className="relative rounded-3xl overflow-hidden min-h-[420px] flex flex-col justify-end p-8 sm:p-12 border border-zinc-800 group shadow-lg">
            <SafeImage
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop"
              alt="Bridal Elegance Collection"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            <div className="relative z-10 space-y-3">
              <span className="text-[11px] uppercase tracking-widest text-gold-400 font-semibold">
                Bridal Suite 2026
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                Heritage Bridal Sets & Chokers
              </h3>
              <p className="text-xs text-zinc-300 max-w-md leading-relaxed">
                Complete bridal suites hand-finished with 24K antique micro-gold plating, matching jimikkis, and complimentary annual re-polishing.
              </p>
              <div className="pt-2">
                <Link href="/collections/bridal-elegance-2026">
                  <Button variant="gold" size="sm" className="gap-2">
                    <span>Discover Bridal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Banner 2: Royal Heritage */}
          <div className="relative rounded-3xl overflow-hidden min-h-[420px] flex flex-col justify-end p-8 sm:p-12 border border-zinc-800 group shadow-lg">
            <SafeImage
              src="https://images.unsplash.com/photo-1611591475155-42e45dbab07f?q=80&w=1200&auto=format&fit=crop"
              alt="Royal Heritage Collection"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            <div className="relative z-10 space-y-3">
              <span className="text-[11px] uppercase tracking-widest text-gold-400 font-semibold">
                Daily Glamour
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                Stone-Studded Bangles & Chains
              </h3>
              <p className="text-xs text-zinc-300 max-w-md leading-relaxed">
                Lightweight, water-resistant, and sweat-durable Kada bangles and rope chains engineered for daily sophistication.
              </p>
              <div className="pt-2">
                <Link href="/collections/daily-glamour-office-wear">
                  <Button variant="outline" size="sm" className="gap-2">
                    <span>Shop Daily Wear</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

