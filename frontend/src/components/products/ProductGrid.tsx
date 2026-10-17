"use client";

import React from "react";
import { IProduct } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

interface ProductGridProps {
  products: IProduct[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  isLoading = false,
  emptyMessage = "No jewellery pieces found matching your criteria.",
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3 rounded-xl bg-zinc-950 p-3 border border-zinc-900">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-8 space-y-3">
        <Sparkles className="w-8 h-8 text-gold-500 mx-auto" />
        <h3 className="text-base font-semibold text-white">No Products Found</h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

