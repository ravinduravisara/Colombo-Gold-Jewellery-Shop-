"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SafeImage } from "@/components/ui/SafeImage";
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Star,
  Plus,
  Minus,
  Check,
  ChevronRight,
} from "lucide-react";
import { IProduct } from "@/types/product";
import { formatLKR } from "@/lib/formatCurrency";
import { SITE_CONFIG } from "@/lib/constants";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/ProductGrid";
import { api } from "@/services/api";

interface ProductDetailsClientProps {
  product: IProduct;
  relatedProducts: IProduct[];
}

export default function ProductDetailsClient({ product, relatedProducts }: ProductDetailsClientProps) {
  const router = useRouter();
  const { addItem, isLoading: isCartLoading } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { showToast } = useUIStore();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants?.[0]?._id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "warranty">("desc");

  // Review submission state
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const images = product.images?.length > 0
    ? product.images
    : [{ url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop", isPrimary: true }];

  const currentImage = images[selectedImageIdx]?.url || images[0].url;

  // Selected variant calculation
  const selectedVariant = product.variants?.find((v) => v._id === selectedVariantId);
  const priceToUse = selectedVariant?.price
    ? (selectedVariant.discountPrice || selectedVariant.price)
    : (product.discountPrice || product.regularPrice);

  const regularPriceToUse = selectedVariant?.price || product.regularPrice;
  const hasDiscount = priceToUse < regularPriceToUse;

  const availableStock = selectedVariant
    ? selectedVariant.stockQuantity
    : product.stockQuantity;

  const isOutOfStock = availableStock <= 0;
  const isFavorited = isInWishlist(product._id);

  // WhatsApp Structured Message
  const variantText = selectedVariant ? ` (Variant: ${selectedVariant.name})` : "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://colombogoldcovering.lk";
  const productUrl = `${siteUrl}/product/${product.slug}`;
  const whatsappMessage = encodeURIComponent(
    `Hello Colombo Gold Covering! I would like to order:
- *Product:* ${product.name}${variantText}
- *SKU:* ${product.sku}
- *Quantity:* ${quantity}
- *Price:* ${formatLKR(priceToUse)}
- *Link:* ${productUrl}

Please confirm availability and bank details / Cash on Delivery dispatch.`
  );
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${whatsappMessage}`;

  const handleAddToCart = async () => {
    try {
      await addItem(product._id, quantity, selectedVariantId || undefined);
      showToast(`Added ${quantity}x ${product.name} to shopping bag`, "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to add to bag", "error");
    }
  };

  const handleBuyNow = async () => {
    try {
      await addItem(product._id, quantity, selectedVariantId || undefined);
      router.push("/checkout");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to proceed to checkout", "error");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    try {
      setIsSubmittingReview(true);
      await api.post("/reviews", {
        productId: product._id,
        userName: reviewName.trim() || "Customer",
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviewSuccess(true);
      setReviewComment("");
      showToast("Thank you! Your review was submitted for moderation.", "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Please sign in to submit a review", "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const categoryName = typeof product.category === "object" ? product.category.name : "Jewellery";
  const categorySlug = typeof product.category === "object" ? product.category.slug : "shop";

  return (
    <div className="bg-zinc-950 min-h-screen text-luxury-ivory py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8 overflow-x-auto pb-1">
          <Link href="/" className="hover:text-gold-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href="/shop" className="hover:text-gold-400">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href={`/category/${categorySlug}`} className="hover:text-gold-400 capitalize">
            {categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-zinc-300 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            {/* Primary Main Image */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-850 shadow-2xl">
              <SafeImage
                src={currentImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {hasDiscount && (
                  <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                    Sale
                  </span>
                )}
                {product.isFeatured && (
                  <span className="px-3 py-1 rounded-full bg-gold-500 text-black text-xs font-bold uppercase tracking-wider shadow-lg">
                    Featured
                  </span>
                )}
              </div>

              {/* Wishlist Floating Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-md transition-all ${
                  isFavorited
                    ? "bg-rose-500 text-white shadow-lg"
                    : "bg-black/60 text-zinc-300 hover:text-white"
                }`}
                aria-label="Toggle Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Thumbnail Selectors */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-900 shrink-0 border-2 transition-all ${
                      selectedImageIdx === idx
                        ? "border-gold-500 shadow-gold"
                        : "border-zinc-800 hover:border-zinc-700 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <SafeImage
                      src={img.url}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Purchase Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
                  {categoryName}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold">{product.rating.toFixed(1)}</span>
                  <span className="text-zinc-500">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="mt-2 text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                {product.name}
              </h1>

              {/* SKU & Stock Availability */}
              <div className="mt-2 flex items-center gap-4 text-xs">
                <span className="text-zinc-500">SKU: <strong className="text-zinc-300">{product.sku}</strong></span>
                <span className="text-zinc-600">&bull;</span>
                {isOutOfStock ? (
                  <span className="text-rose-400 font-semibold">Currently Out of Stock</span>
                ) : (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    In Stock ({availableStock} units ready for dispatch)
                  </span>
                )}
              </div>

              {/* Pricing Display */}
              <div className="mt-6 p-4 rounded-xl bg-zinc-900/60 border border-zinc-850 flex items-baseline gap-4">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-gold-400">
                  {formatLKR(priceToUse)}
                </span>
                {hasDiscount && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base text-zinc-500 line-through">
                      {formatLKR(regularPriceToUse)}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">
                      Save {formatLKR(regularPriceToUse - priceToUse)}
                    </span>
                  </div>
                )}
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="mt-6 text-sm text-zinc-300 leading-relaxed font-light">
                  {product.shortDescription}
                </p>
              )}

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-6 space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                    Select Option / Size:
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v) => (
                      <button
                        key={v._id || v.sku}
                        type="button"
                        onClick={() => setSelectedVariantId(v._id || "")}
                        className={`px-4 py-2 text-xs rounded-lg border transition-all ${
                          selectedVariantId === v._id
                            ? "border-gold-500 bg-gold-500/10 text-gold-300 font-bold shadow-gold"
                            : "border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                  Quantity:
                </span>
                <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-zinc-400 hover:text-white disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                    disabled={quantity >= availableStock}
                    className="p-2 text-zinc-400 hover:text-white disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-6 border-t border-zinc-850">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full text-sm font-bold"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isCartLoading}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {isOutOfStock ? "Out of Stock" : "Add to Bag"}
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full text-sm font-bold"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || isCartLoading}
                >
                  Buy Now
                </Button>
              </div>

              {/* WhatsApp Direct Ordering Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-950/40"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Order via WhatsApp ({SITE_CONFIG.formattedWhatsApp})</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-850 grid grid-cols-3 gap-3 text-center text-[11px] text-zinc-400">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>{product.warrantyMonths}-Month Guarantee</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-gold-400" />
                <span>Islandwide Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-gold-400" />
                <span>Re-Polishing Hub</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Description, Specifications, Warranty */}
        <div className="mt-20 border-t border-zinc-900 pt-12">
          <div className="flex items-center justify-center gap-4 sm:gap-8 border-b border-zinc-850 pb-4">
            <button
              onClick={() => setActiveTab("desc")}
              className={`pb-2 text-sm font-semibold tracking-wider uppercase transition-all ${
                activeTab === "desc"
                  ? "text-gold-400 border-b-2 border-gold-500"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Description & Artistry
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`pb-2 text-sm font-semibold tracking-wider uppercase transition-all ${
                activeTab === "specs"
                  ? "text-gold-400 border-b-2 border-gold-500"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab("warranty")}
              className={`pb-2 text-sm font-semibold tracking-wider uppercase transition-all ${
                activeTab === "warranty"
                  ? "text-gold-400 border-b-2 border-gold-500"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Warranty & Care
            </button>
          </div>

          <div className="py-8 max-w-3xl mx-auto text-sm text-zinc-300 leading-relaxed">
            {activeTab === "desc" && (
              <div className="space-y-4">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {activeTab === "specs" && (
              <div className="overflow-hidden rounded-xl border border-zinc-800">
                <table className="min-w-full divide-y divide-zinc-800 text-xs">
                  <tbody className="divide-y divide-zinc-850">
                    <tr className="bg-zinc-900/40">
                      <td className="py-3 px-4 font-semibold text-zinc-400 w-1/3">SKU</td>
                      <td className="py-3 px-4 text-white">{product.sku}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-zinc-400">Category</td>
                      <td className="py-3 px-4 text-white">{categoryName}</td>
                    </tr>
                    {product.specifications &&
                      Object.entries(product.specifications).map(([key, val]) => (
                        <tr key={key} className="odd:bg-zinc-900/40">
                          <td className="py-3 px-4 font-semibold text-zinc-400">{key}</td>
                          <td className="py-3 px-4 text-white">{String(val)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "warranty" && (
              <div className="space-y-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 p-6">
                <h4 className="text-base font-semibold text-gold-400 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Official Colombo Gold Covering Guarantee</span>
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {product.warrantyDetails || "6 Months Warranty on micro gold electroplating. Includes privileges for workshop re-polishing at our Kotte location."}
                </p>
                <div className="text-xs text-zinc-400 space-y-1.5 pt-2">
                  <p>&bull; Protect against direct alcohol and perfume contact.</p>
                  <p>&bull; Store individually in velvet jewelry pouches.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16 border-t border-zinc-900 pt-16 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white">Customer Reviews</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Rated {product.rating.toFixed(1)} out of 5 based on verified customer feedback.
              </p>
            </div>
          </div>

          {/* Review Submission Form */}
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 mb-12">
            <h4 className="text-sm font-semibold text-white mb-4">Write a Product Review</h4>
            {reviewSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                Thank you for your feedback! Your review has been submitted and will appear after moderation.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priyanthi Jayasuriya"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full h-10 px-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-gold-500"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Exceptional)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars - Great)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
                      <option value={2}>⭐⭐ (2 Stars - Below Expectations)</option>
                      <option value={1}>⭐ (1 Star - Poor)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Your Review</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Share your experience regarding the lustre, weight, and finish of this piece..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <Button type="submit" variant="gold" size="sm" isLoading={isSubmittingReview}>
                  Submit Review
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-zinc-900 pt-16">
            <h3 className="text-2xl font-serif font-bold text-white mb-8 text-center sm:text-left">
              You May Also Adore
            </h3>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}

