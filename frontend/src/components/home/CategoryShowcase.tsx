"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ICategory } from "@/types/product";
import { SafeImage } from "@/components/ui/SafeImage";

interface CategoryShowcaseProps {
  categories: ICategory[];
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
            Curated Jewellery Styles
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Shop by Category
          </h2>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
          <p className="mt-3 text-xs sm:text-sm text-zinc-400">
            Explore our collection of 24K and 22K micro gold-covered jewellery designed for weddings, celebrations, and daily elegance.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className="group relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-gold-500/50 transition-all duration-300 shadow-md hover:shadow-gold"
            >
              {/* Category Image */}
              <SafeImage
                src={cat.image || "/images/placeholders/necklace.jpg"}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Content Box */}
              <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-white group-hover:text-gold-400 transition-colors">
                    {cat.name}
                  </h3>
                  {cat.itemCount !== undefined && (
                    <span className="text-[11px] text-zinc-400 font-medium">
                      {cat.itemCount} {cat.itemCount === 1 ? "Piece" : "Pieces"}
                    </span>
                  )}
                </div>

                <div className="w-8 h-8 rounded-full bg-black/60 border border-gold-500/40 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-black transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

