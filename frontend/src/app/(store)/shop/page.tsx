"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search, Sparkles } from "lucide-react";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { ProductGrid } from "@/components/products/ProductGrid";
import { IProduct, ICategory } from "@/types/product";
import { PaginationMeta } from "@/types/api";

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states from URL
  const currentCategory = searchParams.get("category") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentSort = (searchParams.get("sort") as any) || "newest";
  const inStockOnly = searchParams.get("inStock") === "true";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [searchVal, setSearchVal] = useState(currentSearch);

  // Fetch categories on mount
  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => {});
  }, []);

  // Fetch products whenever search params change
  useEffect(() => {
    setIsLoading(true);
    productService
      .getProducts({
        category: currentCategory || undefined,
        search: currentSearch || undefined,
        sort: currentSort,
        inStock: inStockOnly || undefined,
        page: currentPage,
        limit: 12,
      })
      .then((res) => {
        setProducts(res.products);
        if (res.meta) setMeta(res.meta);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentCategory, currentSearch, currentSort, inStockOnly, currentPage]);

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    // Reset to page 1 on filter update if not changing page
    if (!updates.page) {
      params.delete("page");
    }
    router.push(`/shop?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchVal.trim() });
  };

  const clearAllFilters = () => {
    setSearchVal("");
    router.push("/shop");
  };

  const hasActiveFilters = !!(currentCategory || currentSearch || inStockOnly || currentSort !== "newest");

  return (
    <div className="py-12 bg-zinc-950 min-h-screen text-luxury-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-400 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Catalogue</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Our Jewellery Collection
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            Browse our full selection of 24K and 22K micro gold-covered masterpieces with Sri Lanka islandwide delivery.
          </p>
        </div>

        {/* Search Bar & Primary Filters */}
        <div className="mb-8 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-850 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search by name, SKU, or style..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full h-10 pl-10 pr-20 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold-500"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <button
                type="submit"
                className="absolute right-1 top-1 h-8 px-3 rounded bg-gold-500 text-black text-xs font-semibold hover:bg-gold-600 transition-colors"
              >
                Search
              </button>
            </form>

            {/* Sort & In-Stock Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => updateFilters({ inStock: e.target.checked ? "true" : null })}
                  className="rounded border-zinc-700 bg-zinc-900 text-gold-500 focus:ring-gold-500 w-4 h-4"
                />
                <span>In Stock Only</span>
              </label>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-zinc-400 hidden sm:block" />
                <select
                  value={currentSort}
                  onChange={(e) => updateFilters({ sort: e.target.value })}
                  aria-label="Sort jewellery items"
                  className="h-10 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-gold-500 cursor-pointer"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="best-selling">Best Selling</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-zinc-850">
            <button
              onClick={() => updateFilters({ category: null })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                !currentCategory
                  ? "bg-gold-500 text-black font-semibold shadow-gold"
                  : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => updateFilters({ category: cat.slug })}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                  currentCategory === cat.slug
                    ? "bg-gold-500 text-black font-semibold shadow-gold"
                    : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Active Filter Pills Bar */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-zinc-500">Active Filters:</span>
                {currentCategory && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 text-gold-400">
                    Category: {currentCategory}
                    <button onClick={() => updateFilters({ category: null })}>
                      <X className="w-3 h-3 hover:text-white" />
                    </button>
                  </span>
                )}
                {currentSearch && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 text-gold-400">
                    Search: &ldquo;{currentSearch}&rdquo;
                    <button onClick={() => updateFilters({ search: null })}>
                      <X className="w-3 h-3 hover:text-white" />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 text-gold-400">
                    In Stock Only
                    <button onClick={() => updateFilters({ inStock: null })}>
                      <X className="w-3 h-3 hover:text-white" />
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={clearAllFilters}
                className="text-gold-400 hover:underline text-xs shrink-0"
              >
                Reset All
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <ProductGrid products={products} isLoading={isLoading} />

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-2">
            <button
              onClick={() => updateFilters({ page: String(currentPage - 1) })}
              disabled={!meta.hasPrevPage}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none hover:border-gold-500 text-zinc-300 hover:text-white transition-colors"
            >
              Previous
            </button>

            {Array.from({ length: meta.totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => updateFilters({ page: String(pageNum) })}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold transition-colors ${
                    pageNum === currentPage
                      ? "bg-gold-500 text-black shadow-gold"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-gold-500 hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => updateFilters({ page: String(currentPage + 1) })}
              disabled={!meta.hasNextPage}
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none hover:border-gold-500 text-zinc-300 hover:text-white transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

