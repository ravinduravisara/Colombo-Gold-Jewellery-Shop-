"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  Tag,
  AlertTriangle,
  CheckCircle,
  Package,
} from "lucide-react";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { IProduct, ICategory } from "@/types/product";
import { formatLKR } from "@/lib/formatCurrency";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminProductsPage() {
  const { showToast } = useUIStore();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "inStock" | "lowStock" | "outOfStock">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await productService.getProducts({
        page,
        limit: 15,
        search: search.trim() || undefined,
        category: selectedCategory || undefined,
        all: true, // return published + drafts
      });

      let items = res.products || [];
      if (stockFilter === "lowStock") {
        items = items.filter(
          (p) => p.stockQuantity > 0 && p.stockQuantity <= (p.lowStockThreshold || 5)
        );
      } else if (stockFilter === "outOfStock") {
        items = items.filter((p) => p.stockQuantity <= 0);
      } else if (stockFilter === "inStock") {
        items = items.filter((p) => p.stockQuantity > (p.lowStockThreshold || 5));
      }

      setProducts(items);
      setTotalPages(res.meta?.totalPages || res.meta?.pages || 1);
      setTotalCount(res.meta?.total || items.length);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await categoryService.getCategories();
        setCategories(cats || []);
      } catch (e) {
        console.error("Failed to load categories:", e);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory, stockFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleArchive = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to archive "${productName}"?`)) return;
    try {
      await productService.archiveProduct(productId);
      showToast(`Product "${productName}" archived successfully`, "success");
      fetchProducts();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to archive product", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Jewellery Catalogue</h2>
          <p className="text-xs text-zinc-400">
            Manage your gold-covered inventory, pricing, variants, and stock levels ({totalCount} items)
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button size="sm" className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Add New Jewellery</span>
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, SKU, or keyword..."
              className="pl-10 h-10 text-xs"
            />
          </div>
          <Button type="submit" size="sm" variant="outline" className="h-10 text-xs px-4">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-gold-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value as any);
              setPage(1);
            }}
            className="h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Stock Statuses</option>
            <option value="inStock">In Stock</option>
            <option value="lowStock">Low Stock Alert</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-zinc-500 text-xs">Loading jewellery products...</div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Package className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 text-xs">No jewellery products matched your criteria.</p>
            <Link href="/admin/products/new">
              <Button size="sm">Create First Product</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px] bg-zinc-950/40">
                  <th className="py-3.5 px-4">Item & SKU</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Price (LKR)</th>
                  <th className="py-3.5 px-3">Stock Level</th>
                  <th className="py-3.5 px-3">Attributes</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {products.map((product) => {
                  const imageSrc =
                    product.images?.[0]?.url || "/images/placeholders/necklace.jpg";
                  const isLowStock =
                    product.stockQuantity > 0 &&
                    product.stockQuantity <= (product.lowStockThreshold || 5);
                  const isOut = product.stockQuantity <= 0;

                  return (
                    <tr key={product._id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden relative flex-shrink-0">
                            <SafeImage
                              src={imageSrc}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/admin/products/${product._id}/edit`}
                              className="font-medium text-white hover:text-gold-400 transition-colors block text-sm line-clamp-1"
                            >
                              {product.name}
                            </Link>
                            <span className="text-[11px] text-zinc-500 font-mono">
                              SKU: {product.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-zinc-300">
                        {typeof product.category === "object"
                          ? product.category?.name
                          : "Jewellery"}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-serif font-bold text-gold-400 text-sm">
                          {formatLKR(product.discountPrice || product.regularPrice)}
                        </span>
                        {product.discountPrice && (
                          <span className="block text-[10px] text-zinc-500 line-through">
                            {formatLKR(product.regularPrice)}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            isOut
                              ? "bg-red-950/60 text-red-400 border border-red-500/30"
                              : isLowStock
                              ? "bg-amber-950/60 text-amber-400 border border-amber-500/30"
                              : "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isOut
                                ? "bg-red-400"
                                : isLowStock
                                ? "bg-amber-400 animate-ping"
                                : "bg-emerald-400"
                            }`}
                          />
                          <span>
                            {isOut
                              ? "Out of Stock"
                              : `${product.stockQuantity} units`}
                          </span>
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          {product.isFeatured && (
                            <span className="px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/20 text-[10px]">
                              Featured
                            </span>
                          )}
                          {product.isBestSeller && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px]">
                              Best Seller
                            </span>
                          )}
                          {product.isNewArrival && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                              New
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                            title="View on Storefront"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-gold-400 hover:bg-zinc-800"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleArchive(product._id, product.name)}
                            className="p-1.5 rounded-lg text-red-400/80 hover:text-red-300 hover:bg-red-950/30"
                            title="Archive Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
