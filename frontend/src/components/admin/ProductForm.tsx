"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Upload,
  Plus,
  Trash2,
  Check,
  Star,
  Sparkles,
  ArrowLeft,
  X,
} from "lucide-react";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { IProduct, ICategory, ICollection, IProductVariant } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/store/uiStore";

interface ProductFormProps {
  initialData?: IProduct;
  isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const { showToast } = useUIStore();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Form Fields
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [sku, setSku] = useState(initialData?.sku || "");
  const [categoryId, setCategoryId] = useState(
    typeof initialData?.category === "object"
      ? (initialData.category as any)?._id
      : initialData?.category || ""
  );
  const [collectionId, setCollectionId] = useState(
    typeof initialData?.collectionRef === "object"
      ? (initialData.collectionRef as any)?._id
      : initialData?.collectionRef || ""
  );

  // Price inputs are in main LKR (e.g. 1500)
  const [regularPriceLkr, setRegularPriceLkr] = useState(
    initialData?.regularPrice ? (initialData.regularPrice / 100).toString() : ""
  );
  const [discountPriceLkr, setDiscountPriceLkr] = useState(
    initialData?.discountPrice ? (initialData.discountPrice / 100).toString() : ""
  );
  const [stockQuantity, setStockQuantity] = useState(
    initialData?.stockQuantity?.toString() || "10"
  );
  const [lowStockThreshold, setLowStockThreshold] = useState(
    initialData?.lowStockThreshold?.toString() || "5"
  );
  const [warrantyMonths, setWarrantyMonths] = useState(
    initialData?.warrantyMonths?.toString() || "12"
  );
  const [warrantyDetails, setWarrantyDetails] = useState(
    initialData?.warrantyDetails || "1 Year Color & Luster Warranty with Lifetime Re-polishing Support"
  );

  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription || ""
  );
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  // Flags
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [isBestSeller, setIsBestSeller] = useState(initialData?.isBestSeller || false);
  const [isNewArrival, setIsNewArrival] = useState(
    initialData ? initialData.isNewArrival : true
  );
  const [isPublished, setIsPublished] = useState(
    initialData ? initialData.isPublished : true
  );

  // Images
  const [images, setImages] = useState<Array<{ url: string; isPrimary: boolean; altText?: string }>>(
    initialData?.images || []
  );

  // Variants
  const [variants, setVariants] = useState<IProductVariant[]>(
    initialData?.variants || []
  );
  const [newVariantName, setNewVariantName] = useState("");
  const [newVariantSku, setNewVariantSku] = useState("");
  const [newVariantStock, setNewVariantStock] = useState("5");
  const [newVariantPriceLkr, setNewVariantPriceLkr] = useState("");

  useEffect(() => {
    async function loadMeta() {
      try {
        const [cats, cols] = await Promise.all([
          categoryService.getCategories(),
          categoryService.getCollections(),
        ]);
        setCategories(cats || []);
        setCollections(cols || []);
        if (!categoryId && cats?.length > 0) {
          setCategoryId(cats[0]._id);
        }
      } catch (err) {
        console.error("Failed to load metadata:", err);
      }
    }
    loadMeta();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing && !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploadingImage(true);
      const uploaded = await productService.uploadProductImage(file);
      if (uploaded?.url) {
        const isFirst = images.length === 0;
        setImages((prev) => [
          ...prev,
          { url: uploaded.url, isPrimary: isFirst, altText: name },
        ]);
        showToast("Image uploaded to media cloud", "success");
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to upload image", "error");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const setPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const addVariant = () => {
    if (!newVariantName.trim()) {
      showToast("Variant name is required", "error");
      return;
    }
    const variantItem: IProductVariant = {
      name: newVariantName.trim(),
      sku: newVariantSku.trim() || `${sku}-${variants.length + 1}`,
      stockQuantity: parseInt(newVariantStock) || 0,
      price: newVariantPriceLkr ? Math.round(parseFloat(newVariantPriceLkr) * 100) : undefined,
      attributes: { variant: newVariantName.trim() },
    };
    setVariants([...variants, variantItem]);
    setNewVariantName("");
    setNewVariantSku("");
    setNewVariantStock("5");
    setNewVariantPriceLkr("");
  };

  const removeVariant = (idx: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return showToast("Product name is required", "error");
    if (!sku.trim()) return showToast("Product SKU is required", "error");
    if (!categoryId) return showToast("Please select a category", "error");
    if (!regularPriceLkr || isNaN(parseFloat(regularPriceLkr))) {
      return showToast("Valid regular price in LKR is required", "error");
    }
    if (images.length === 0) {
      return showToast("Please upload at least one jewellery image", "error");
    }

    try {
      setIsLoading(true);

      const regularPrice = Math.round(parseFloat(regularPriceLkr) * 100);
      const discountPrice = discountPriceLkr
        ? Math.round(parseFloat(discountPriceLkr) * 100)
        : undefined;

      const payload: Partial<IProduct> = {
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        sku: sku.trim().toUpperCase(),
        category: categoryId,
        collectionRef: collectionId || undefined,
        regularPrice,
        discountPrice,
        stockQuantity: parseInt(stockQuantity) || 0,
        lowStockThreshold: parseInt(lowStockThreshold) || 5,
        warrantyMonths: parseInt(warrantyMonths) || 12,
        warrantyDetails: warrantyDetails.trim(),
        shortDescription: shortDescription.trim(),
        description: description.trim() || shortDescription.trim(),
        images,
        variants,
        isFeatured,
        isBestSeller,
        isNewArrival,
        isPublished,
      };

      if (isEditing && initialData?._id) {
        await productService.updateProduct(initialData._id, payload);
        showToast("Jewellery product updated successfully", "success");
      } else {
        await productService.createProduct(payload);
        showToast("New jewellery piece listed in catalogue", "success");
      }

      router.push("/admin/products");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to save product", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-serif font-bold text-white">
              {isEditing ? `Edit: ${initialData?.name}` : "Add New Jewellery"}
            </h2>
            <p className="text-xs text-zinc-400">
              Provide accurate jewellery details, specifications, and photography
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || isUploadingImage}>
            {isLoading ? "Saving..." : isEditing ? "Save Changes" : "Publish Jewellery"}
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Core Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Card */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif font-bold text-white text-base">General Information</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Jewellery Piece Title *
              </label>
              <Input
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. 24K Gold-Plated Peacock Bridal Necklace"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  SKU (Stock Keeping Unit) *
                </label>
                <Input
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. CGC-NECK-001"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  URL Slug
                </label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. 24k-gold-plated-peacock-bridal-necklace"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Short Highlight Summary
              </label>
              <Input
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief 1-2 sentence description for quick views and search snippets"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Full Description & Craftsmanship Details
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of micro-gold plating quality, base metal alloy, care instructions..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs leading-relaxed focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* Pricing & Stock Card */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif font-bold text-white text-base">Pricing & Inventory</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Regular Price (LKR) *
                </label>
                <Input
                  required
                  type="number"
                  min="0"
                  step="50"
                  value={regularPriceLkr}
                  onChange={(e) => setRegularPriceLkr(e.target.value)}
                  placeholder="e.g. 15500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Discount Price (LKR)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="50"
                  value={discountPriceLkr}
                  onChange={(e) => setDiscountPriceLkr(e.target.value)}
                  placeholder="Optional promotional price"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Stock Units In Showroom *
                </label>
                <Input
                  required
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  placeholder="e.g. 12"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Low Stock Threshold Alert
                </label>
                <Input
                  type="number"
                  min="1"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  placeholder="e.g. 5"
                />
              </div>
            </div>
          </div>

          {/* Images Gallery Card */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-white text-base">Product Images</h3>
                <p className="text-xs text-zinc-400">High-resolution jewellery photos</p>
              </div>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageUpload(f);
                  }}
                  disabled={isUploadingImage}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploadingImage}
                  className="pointer-events-none text-xs"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  <span>{isUploadingImage ? "Uploading..." : "Upload Photo"}</span>
                </Button>
              </label>
            </div>

            {images.length === 0 ? (
              <div className="border border-dashed border-zinc-800 rounded-xl p-8 text-center text-zinc-500 text-xs">
                No images added yet. Upload high-definition pictures of the jewellery.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative aspect-square rounded-xl overflow-hidden border bg-zinc-950 group ${
                      img.isPrimary ? "border-gold-500 ring-2 ring-gold-500/30" : "border-zinc-800"
                    }`}
                  >
                    <Image src={img.url} alt="Jewellery" fill className="object-cover" />

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      {!img.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(idx)}
                          className="p-1.5 rounded-lg bg-zinc-800 text-gold-400 hover:bg-gold-500 hover:text-zinc-950 transition-colors"
                          title="Set as Main Cover"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="p-1.5 rounded-lg bg-red-950/80 text-red-400 hover:bg-red-900 transition-colors"
                        title="Delete Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {img.isPrimary && (
                      <span className="absolute bottom-2 left-2 text-[9px] font-bold uppercase bg-gold-500 text-zinc-950 px-2 py-0.5 rounded shadow">
                        Primary Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Variants Card */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif font-bold text-white text-base">
              Product Variants (Sizes / Lengths)
            </h3>
            <p className="text-xs text-zinc-400">
              Optional size variants (e.g. Bangle Size 2.4, 2.6, 2.8 or Necklace Chain 18&quot;, 20&quot;, 24&quot;)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
              <Input
                placeholder="Variant Name (e.g. Size 2.6)"
                value={newVariantName}
                onChange={(e) => setNewVariantName(e.target.value)}
                className="text-xs h-9"
              />
              <Input
                placeholder="SKU Suffix (Optional)"
                value={newVariantSku}
                onChange={(e) => setNewVariantSku(e.target.value)}
                className="text-xs h-9"
              />
              <Input
                type="number"
                placeholder="Stock Qty"
                value={newVariantStock}
                onChange={(e) => setNewVariantStock(e.target.value)}
                className="text-xs h-9"
              />
              <Button type="button" size="sm" onClick={addVariant} className="text-xs h-9">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Variant
              </Button>
            </div>

            {variants.length > 0 && (
              <div className="divide-y divide-zinc-800">
                {variants.map((v, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white">{v.name}</span>
                      <span className="text-zinc-500 ml-2 font-mono">({v.sku})</span>
                      <span className="text-gold-400 ml-3">Stock: {v.stockQuantity}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Category, Organization & Badges */}
        <div className="space-y-6">
          {/* Classification */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif font-bold text-white text-base">Classification</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-gold-500"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Collection Group (Optional)
              </label>
              <select
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-gold-500"
              >
                <option value="">None / Standalone</option>
                {collections.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Warranty Details */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif font-bold text-white text-base">Warranty & Guarantee</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Warranty Period (Months)
              </label>
              <Input
                type="number"
                min="0"
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Warranty Certificate Terms
              </label>
              <Input
                value={warrantyDetails}
                onChange={(e) => setWarrantyDetails(e.target.value)}
              />
            </div>
          </div>

          {/* Storefront Visibility Flags */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h3 className="font-serif font-bold text-white text-base">Storefront Badges</h3>

            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="isPublished"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="accent-gold-500 w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor="isPublished" className="text-xs text-zinc-300 cursor-pointer">
                Published & Active on Website
              </label>
            </div>

            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="accent-gold-500 w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor="isFeatured" className="text-xs text-zinc-300 cursor-pointer">
                Feature on Homepage Showcase
              </label>
            </div>

            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="isBestSeller"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="accent-gold-500 w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor="isBestSeller" className="text-xs text-zinc-300 cursor-pointer">
                Highlight as Best Seller
              </label>
            </div>

            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="isNewArrival"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="accent-gold-500 w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor="isNewArrival" className="text-xs text-zinc-300 cursor-pointer">
                Badge as New Arrival
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

