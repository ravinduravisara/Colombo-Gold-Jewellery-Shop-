"use client";

import React from "react";
import { Play, ExternalLink, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { SafeImage } from "@/components/ui/SafeImage";

interface TikTokItem {
  _id: string;
  title: string;
  type: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  tiktokUsername?: string;
}

interface TikTokGalleryProps {
  items: TikTokItem[];
}

export function TikTokGallery({ items }: TikTokGalleryProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-20 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold mb-2">
              <span>Viral Showcases</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              As Seen On TikTok
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-lg">
              Explore our trending video showcases on {SITE_CONFIG.tiktokHandle} featuring close-up polish tests and customer styling.
            </p>
          </div>

          <a
            href={SITE_CONFIG.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-gold-400 hover:text-gold-300 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <span>Follow {SITE_CONFIG.tiktokHandle}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const thumbnail =
              item.thumbnailUrl ||
              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop";

            const whatsappMessage = encodeURIComponent(
              `Hello Colombo Gold Covering! I saw your TikTok video "${item.title}" and would like to order or ask about the jewellery shown.`
            );
            const orderViaWhatsAppUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${whatsappMessage}`;

            return (
              <div
                key={item._id}
                className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-850 hover:border-gold-500/50 transition-all duration-300 flex flex-col justify-between shadow-lg"
              >
                {/* Thumbnail Stage */}
                <a
                  href={item.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-[9/14] w-full block bg-black overflow-hidden"
                >
                  <SafeImage
                    src={thumbnail}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                  />

                  {/* Play Button Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-black transition-all shadow-xl">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>

                  {/* TikTok watermark badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-medium flex items-center gap-1.5 border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>{item.tiktokUsername || SITE_CONFIG.tiktokHandle}</span>
                  </div>
                </a>

                {/* Details & WhatsApp CTA */}
                <div className="p-4 bg-zinc-950 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-gold-400 transition-colors">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                        {item.caption}
                      </p>
                    )}
                  </div>

                  <a
                    href={orderViaWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Order via WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

