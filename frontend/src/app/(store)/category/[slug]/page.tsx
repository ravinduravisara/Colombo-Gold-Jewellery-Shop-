import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Sparkles, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await categoryService.getCategoryBySlug(slug);
    if (!category) throw new Error();
    return {
      title: `${category.name} | Colombo Gold Covering`,
      description: category.description || `Explore our luxury gold-covered ${category.name} in Sri Lanka.`,
    };
  } catch {
    return {
      title: "Jewellery Category | Colombo Gold Covering",
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  let category: any = null;
  let products: any[] = [];

  try {
    category = await categoryService.getCategoryBySlug(slug);
    if (category) {
      const res = await productService.getProducts({ category: category.slug, limit: 24 });
      products = res.products || [];
    }
  } catch {
    category = { name: slug.replace(/-/g, " "), slug };
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="py-12 bg-zinc-950 min-h-screen text-luxury-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
          <Link href="/" className="hover:text-gold-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-gold-400">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-300 capitalize">{category.name}</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-400 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Category Collection</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight capitalize">
            {category.name}
          </h1>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
          {category.description && (
            <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {category.description}
            </p>
          )}
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}

