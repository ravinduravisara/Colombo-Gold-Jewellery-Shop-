import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Sparkles, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface CollectionDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const col = await categoryService.getCollectionBySlug(slug);
    if (!col) throw new Error();
    return {
      title: `${col.name} | Colombo Gold Covering`,
      description: col.description || `Explore our luxury ${col.name} collection in Sri Lanka.`,
    };
  } catch {
    return {
      title: "Jewellery Collection | Colombo Gold Covering",
    };
  }
}

export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const { slug } = await params;
  let collection: any = null;
  let products: any[] = [];

  try {
    collection = await categoryService.getCollectionBySlug(slug);
    if (collection) {
      const res = await productService.getProducts({ collection: collection.slug, limit: 24 });
      products = res.products || [];
    }
  } catch {
    collection = { name: slug.replace(/-/g, " "), slug };
  }

  if (!collection) {
    notFound();
  }

  return (
    <div className="py-12 bg-zinc-950 min-h-screen text-luxury-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
          <Link href="/" className="hover:text-gold-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/collections" className="hover:text-gold-400">Collections</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-300 capitalize">{collection.name}</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-400 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Collection</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight capitalize">
            {collection.name}
          </h1>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
          {collection.description && (
            <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {collection.description}
            </p>
          )}
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}

