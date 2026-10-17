import React from "react";
import { Sparkles, Play, MessageCircle, ExternalLink } from "lucide-react";
import { api } from "@/services/api";
import { SITE_CONFIG } from "@/lib/constants";
import { SafeImage } from "@/components/ui/SafeImage";

export const metadata = {
  title: "Jewellery Gallery & TikTok Showcases | Colombo Gold Covering",
  description: "Browse curated photos and viral TikTok video demonstrations of our gold-covered jewellery.",
};

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function GalleryPage() {
  let mediaItems: any[] = [];
  try {
    const res = await api.get("/gallery");
    mediaItems = res.data.data || [];
  } catch {
    mediaItems = [];
  }

  return (
    <div className="py-16 bg-zinc-950 min-h-screen text-luxury-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-400 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Showcase</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Jewellery Gallery &amp; TikToks
          </h1>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
          <p className="mt-3 text-xs sm:text-sm text-zinc-400">
            See our craftsmanship in motion. Watch live demonstrations, polish tests, and bridal stylings directly from our official channel {SITE_CONFIG.tiktokHandle}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mediaItems.map((item: any) => {
            const isTikTok = item.type === "tiktok";
            const thumbnail =
              item.thumbnailUrl ||
              item.mediaUrl ||
              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop";

            const whatsappMessage = encodeURIComponent(
              `Hello Colombo Gold Covering! I saw your gallery piece "${item.title}" and would like to order or ask about it.`
            );
            const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${whatsappMessage}`;

            return (
              <div
                key={item._id}
                className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-850 hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div className="relative aspect-[9/13] w-full bg-black overflow-hidden">
                  <SafeImage
                    src={thumbnail}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {isTikTok && (
                    <a
                      href={item.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-black/60 border border-gold-500/40 flex items-center justify-center text-white backdrop-blur-sm group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-black transition-all">
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </a>
                  )}

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-medium border border-white/10">
                    {isTikTok ? "TikTok Video" : "Jewellery Photo"}
                  </div>
                </div>

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
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
