"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatLKR } from "@/lib/formatCurrency";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, subtotal, isOpen, setIsOpen, updateQuantity, removeItem, isLoading } =
    useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 flex flex-col justify-between text-luxury-ivory shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-zinc-850 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              <h2 className="text-lg font-serif font-bold text-white tracking-wide">
                Your Shopping Bag
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-gold-400">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Your bag is empty</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Discover our collection of handcrafted gold-covered jewellery.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/shop">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-3.5 rounded-xl bg-zinc-900/50 border border-zinc-850 hover:border-zinc-800 transition-all"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="text-xs font-semibold text-white hover:text-gold-400 line-clamp-1 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-zinc-500 hover:text-rose-400 p-0.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.variantName && (
                        <p className="text-[11px] text-zinc-400 mt-0.5">{item.variantName}</p>
                      )}

                      <p className="text-xs font-bold text-gold-400 mt-1">
                        {formatLKR(item.price)}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center rounded border border-zinc-800 bg-zinc-950">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={isLoading}
                          className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-medium text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={isLoading || item.quantity >= item.availableStock}
                          className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {item.isOutOfStock && (
                        <span className="text-[10px] text-rose-500 font-medium">Out of stock</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Actions */}
          {items.length > 0 && (
            <div className="p-6 border-t border-zinc-850 bg-zinc-950 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">{formatLKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-500 text-[11px]">
                  <span>Shipping calculated at checkout</span>
                  <span>Sri Lanka Islandwide</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full justify-between"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/checkout" className="flex items-center justify-between w-full">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  className="w-full text-xs"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/cart">View Detailed Cart</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

