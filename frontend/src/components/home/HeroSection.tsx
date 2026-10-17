"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Truck, RotateCcw, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";
import { SafeImage } from "@/components/ui/SafeImage";

export function HeroSection() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    "Hello Colombo Gold Covering! I would like to explore your luxury bridal collections and custom gold-covered jewellery."
  )}`;

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-950">
      {/* Background Hero Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <SafeImage
          src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1920&auto=format&fit=crop"
          alt="Colombo Gold Covering Luxury Hero"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30 scale-105 animate-pulse-subtle"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,166,103,0.1)_0,transparent_70%)]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Sub-badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-gold-500/40 text-gold-400 text-xs font-semibold tracking-widest uppercase mb-6 shadow-gold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sri Lanka&apos;s Premier Gold-Covered Jewellery</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight leading-[1.1] mb-6">
          The Pure Radiance of <br />
          <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 bg-clip-text text-transparent">
            24K Micro Gold Covering
          </span>
        </h1>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-300 font-light leading-relaxed mb-10">
          Handcrafted bridal sets, traditional necklaces, kada bangles, and heirloom earrings with genuine micro-gold plating and our trusted 6-month warranty.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/shop" className="w-full sm:w-auto">
            <Button variant="gold" size="lg" className="w-full sm:w-auto px-8 gap-2 group">
              <span>Shop All Collections</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8 gap-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Direct Enquiry</span>
            </Button>
          </a>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-zinc-400 text-xs">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <span>6-Month Guarantee</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Truck className="w-4 h-4 text-gold-400" />
            <span>Islandwide COD Delivery</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4 text-gold-400" />
            <span>Kotte Re-Polishing Hub</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Hypoallergenic Core</span>
          </div>
        </div>
      </div>
    </section>
  );
}

