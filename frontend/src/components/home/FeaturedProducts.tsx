"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { IProduct } from "@/types/product";
import { ProductGrid } from "@/components/products/ProductGrid";

interface FeaturedProductsProps {
  products: IProduct[];
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
}

export function FeaturedProducts({
  products,
  title = "Featured Masterpieces",
  subtitle = "Our most beloved gold-covered bridal sets and festive necklaces",
  viewAllLink = "/shop?featured=true",
}: FeaturedProductsProps) {
  return (
    <section className="py-20 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handcrafted Radiance</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              {title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-lg">{subtitle}</p>
          </div>

          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors uppercase tracking-wider group"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  );
}

