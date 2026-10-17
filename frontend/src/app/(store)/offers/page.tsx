import React from "react";
import Link from "next/link";
import { productService } from "@/services/productService";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Sparkles, ChevronRight, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Special Offers & Promotions | Colombo Gold Covering",
  description: "Limited-time deals, discounts, and promotional offers on gold-covered jewellery.",
};

export default async function OffersPage() {
  let products: any[] = [];
  try {
    const res = await productService.getProducts({ limit: 50 });
    products = res.products || [];
  } catch {
    products = [];
  }

  const discountedProducts = products.filter(
    (p) => p.discountPrice && p.discountPrice < p.regularPrice
  );

  return (
    <div className="py-12 bg-zinc-950 min-h-screen text-luxury-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
          <Link href="/" className="hover:text-gold-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-300">Special Offers</span>
        </nav>

        {/* Festive Promo Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-950/60 via-zinc-900 to-amber-950/60 border border-gold-500/30 p-8 sm:p-12 text-center mb-14 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500 text-black text-xs font-bold uppercase tracking-widest">
              <Tag className="w-3 h-3" />
              Limited Time Deals
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Festive Season Discounts
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300">
              Enjoy up to 20% savings on selected bridal sets and kada bangles. Use code <strong className="text-gold-400 underline">GOLD10</strong> for an extra 10% off orders over Rs. 5,000!
            </p>
          </div>
        </div>

        <ProductGrid
          products={discountedProducts}
          emptyMessage="No promotional discounted items available right now. Please check back soon!"
        />
      </div>
    </div>
  );
}

