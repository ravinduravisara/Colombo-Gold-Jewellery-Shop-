"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Sparkles } from "lucide-react";
import { IProduct } from "@/types/product";
import { formatLKR } from "@/lib/formatCurrency";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { SafeImage } from "@/components/ui/SafeImage";

interface ProductCardProps {
  product: IProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addItem, isLoading: isCartLoading } = useCartStore();
  const { setQuickViewProduct, showToast } = useUIStore();

  const isFavorited = isInWishlist(product._id);
  const primaryImage = product.images?.[0]?.url || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop";
  const hoverImage = product.images?.[1]?.url || primaryImage;

  const currentPrice = product.discountPrice || product.regularPrice;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.regularPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.regularPrice - product.discountPrice!) / product.regularPrice) * 100)
    : 0;

  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addItem(product._id, 1);
      showToast(`Added ${product.name} to shopping bag`, "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to add to bag", "error");
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const added = await toggleWishlist(product);
      showToast(
        added ? "Saved to your wishlist" : "Removed from wishlist",
        "info"
      );
    } catch {
      showToast("Please sign in to save your wishlist", "error");
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div className="group relative flex flex-col rounded-xl bg-zinc-950/80 border border-zinc-850 hover:border-gold-500/40 transition-all duration-300 hover:shadow-gold overflow-hidden">
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
        {hasDiscount && (
          <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-md">
            -{discountPercent}%
          </span>
        )}
        {product.isNewArrival && (
          <span className="px-2 py-0.5 rounded-full bg-gold-500 text-black text-[10px] font-bold tracking-wider uppercase shadow-md">
            New
          </span>
        )}
        {product.isBestSeller && (
          <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-gold-500/40 text-gold-400 text-[10px] font-semibold tracking-wider uppercase">
            Best Seller
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
          isFavorited
            ? "bg-rose-500 text-white shadow-lg"
            : "bg-black/50 text-zinc-300 hover:text-white hover:bg-black/80"
        }`}
        aria-label="Add to wishlist"
      >
        <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
      </button>

      {/* Product Image Stage */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square w-full bg-zinc-900 overflow-hidden block">
        <SafeImage
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="px-3 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-semibold uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-0 bottom-3 px-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hidden sm:flex">
          <button
            onClick={handleQuickView}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-zinc-950/90 border border-gold-500/40 text-gold-300 text-xs font-medium backdrop-blur-md shadow-lg hover:bg-gold-500 hover:text-black transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        </div>
      </Link>

      {/* Info Section */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          {/* Category */}
          <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">
            {typeof product.category === "object" ? product.category.name : "Jewellery"}
          </span>

          {/* Title */}
          <Link
            href={`/product/${product.slug}`}
            className="block mt-1 text-sm font-semibold text-white group-hover:text-gold-400 transition-colors line-clamp-1"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-3 pt-3 border-t border-zinc-850 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-gold-400">
                {formatLKR(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-zinc-500 line-through">
                  {formatLKR(product.regularPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isCartLoading}
            className="p-2 rounded-full bg-gold-500 hover:bg-gold-600 text-black shadow-gold disabled:opacity-30 disabled:pointer-events-none transition-all hover:scale-105"
            aria-label={`Add ${product.name} to bag`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

