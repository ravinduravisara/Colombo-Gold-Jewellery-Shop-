"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { formatLKR } from "@/lib/formatCurrency";
import { Button } from "@/components/ui/button";

export default function AccountWishlistPage() {
  const { items, isLoading, fetchWishlist, toggleWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { showToast } = useUIStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleAddToCart = async (product: any) => {
    try {
      await addItem(product._id, 1);
      showToast(`${product.name} added to your bag!`, "success");
    } catch {
      showToast("Failed to add product to bag", "error");
    }
  };

  const handleRemove = async (product: any) => {
    try {
      await toggleWishlist(product);
      showToast("Removed from wishlist", "info");
    } catch {
      showToast("Could not update wishlist", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Saved Wishlist</h2>
          <p className="text-xs text-zinc-400">
            {items.length} saved jewellery piece{items.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link href="/shop">
          <Button variant="ghost" size="sm" className="text-gold-400 hover:text-gold-300">
            Continue Shopping
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-zinc-500 text-sm">Loading wishlist...</div>
      ) : items.length === 0 ? (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-12 text-center space-y-4">
          <Heart className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-lg font-serif font-bold text-white">Your Wishlist is Empty</h3>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            Save exquisite necklaces, bangles, and earrings to review or purchase anytime.
          </p>
          <Link href="/shop">
            <Button>Explore Jewellery</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {items.map((product) => {
            const primaryImage =
              product.images?.[0]?.url || "/images/placeholders/necklace.jpg";
            return (
              <div
                key={product._id}
                className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden hover:border-gold-500/40 transition-all flex flex-col justify-between group"
              >
                <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden">
                  <SafeImage
                    src={primaryImage}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => handleRemove(product)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-red-400 hover:bg-black/90 transition-colors backdrop-blur-sm"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/product/${product.slug}`}
                      className="text-sm font-serif font-semibold text-white hover:text-gold-400 transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {typeof product.category === "object" ? product.category?.name : "Jewellery"}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="font-serif font-bold text-gold-400 text-sm">
                      {formatLKR(product.discountPrice || product.regularPrice)}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      className="text-xs px-2.5 py-1.5 h-8 flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
