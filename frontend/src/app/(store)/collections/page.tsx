import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { categoryService } from "@/services/categoryService";
import { SafeImage } from "@/components/ui/SafeImage";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function CollectionsPage() {
  const collections = await categoryService.getCollections().catch(() => []);

  return (
    <div className="py-16 bg-zinc-950 min-h-screen text-luxury-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-400 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Themes</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Our Jewellery Collections
          </h1>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
          <p className="mt-3 text-xs sm:text-sm text-zinc-400">
            Explore heritage bridal suites, daily office essentials, and festive masterpieces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((col) => (
            <Link
              key={col._id}
              href={`/collections/${col.slug}`}
              className="group relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-gold-500/50 transition-all duration-300 min-h-[380px] flex flex-col justify-end p-8 shadow-lg hover:shadow-gold"
            >
              <SafeImage
                src={col.bannerImage || "/images/placeholders/necklace.jpg"}
                alt={col.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif font-bold text-white group-hover:text-gold-400 transition-colors">
                    {col.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-black/60 border border-gold-500/40 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-black transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                {col.description && (
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                    {col.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
