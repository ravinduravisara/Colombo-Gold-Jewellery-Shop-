import React from "react";
import Link from "next/link";
import { productService } from "@/services/productService";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Sparkles, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New Arrivals | Colombo Gold Covering",
  description: "Explore the latest 24K and 22K micro gold-covered jewellery arrivals.",
};

export default async function NewArrivalsPage() {
  let products: any[] = [];
  try {
    const res = await productService.getProducts({ newArrival: true, limit: 24 });
    products = res.products || [];
  } catch {
    products = [];
  }

  return (
    <div className="py-12 bg-zinc-950 min-h-screen text-luxury-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
          <Link href="/" className="hover:text-gold-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-300">New Arrivals</span>
        </nav>

        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-400 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Just Released</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            New Jewellery Arrivals
          </h1>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Freshly crafted chokers, kada bangles, jimikkis, and delicate chains straight from our master workshop.
          </p>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}

