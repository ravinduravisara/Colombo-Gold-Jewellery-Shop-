"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageCircle, ShoppingBag, Star, Check, ExternalLink } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/uiStore";
import { useCartStore } from "@/store/cartStore";
import { formatLKR } from "@/lib/formatCurrency";
import { SITE_CONFIG } from "@/lib/constants";
import { SafeImage } from "@/components/ui/SafeImage";

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, showToast } = useUIStore();
  const { addItem, isLoading } = useCartStore();

  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const currentPrice = product.discountPrice || product.regularPrice;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.regularPrice;
  const primaryImage = product.images?.[0]?.url || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop";

  const handleAddToCart = async () => {
    try {
      await addItem(product._id, quantity, selectedVariantId || undefined);
      showToast(`Added ${product.name} to shopping bag`, "success");
      setQuickViewProduct(null);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to add to bag", "error");
    }
  };

  // WhatsApp order link
  const selectedVariant = product.variants?.find((v) => v._id === selectedVariantId);
  const variantText = selectedVariant ? ` Variant: ${selectedVariant.name}.` : "";
  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://colombogoldcovering.lk"}/product/${product.slug}`;
  const whatsappMsg = encodeURIComponent(
    `Hello Colombo Gold Covering! I would like to order *${product.name}* (SKU: ${product.sku}).${variantText} Quantity: ${quantity}. Price: ${formatLKR(currentPrice)}. Product Link: ${productUrl}`
  );
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${whatsappMsg}`;

  return (
    <Dialog
      isOpen={!!quickViewProduct}
      onClose={() => setQuickViewProduct(null)}
      className="max-w-2xl p-0 overflow-hidden"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square sm:aspect-auto sm:h-full bg-zinc-900 min-h-[300px]">
          <SafeImage
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 350px"
          />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold">{product.rating.toFixed(1)}</span>
              <span className="text-zinc-500">({product.reviewCount} reviews)</span>
            </div>

            <h3 className="mt-2 text-lg font-serif font-bold text-white leading-snug">
              {product.name}
            </h3>

            <p className="text-xs text-zinc-500 mt-0.5">SKU: {product.sku}</p>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl font-bold text-gold-400">
                {formatLKR(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-zinc-500 line-through">
                  {formatLKR(product.regularPrice)}
                </span>
              )}
            </div>

            {product.shortDescription && (
              <p className="mt-3 text-xs text-zinc-300 leading-relaxed line-clamp-3">
                {product.shortDescription}
              </p>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-4">
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                  Select Variant / Size:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v._id || v.sku}
                      type="button"
                      onClick={() => setSelectedVariantId(v._id || "")}
                      className={`px-3 py-1 text-xs rounded border transition-all ${
                        selectedVariantId === v._id
                          ? "border-gold-500 bg-gold-500/10 text-gold-300 font-semibold"
                          : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4 border-t border-zinc-850">
            <Button
              variant="gold"
              className="w-full"
              onClick={handleAddToCart}
              isLoading={isLoading}
              disabled={product.stockQuantity <= 0}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {product.stockQuantity > 0 ? "Add to Bag" : "Out of Stock"}
            </Button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-md bg-emerald-600/90 hover:bg-emerald-600 text-white font-medium text-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Order via WhatsApp
            </a>

            <div className="text-center pt-1">
              <Link
                href={`/product/${product.slug}`}
                onClick={() => setQuickViewProduct(null)}
                className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-gold-400 transition-colors"
              >
                <span>View Complete Product Details</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

