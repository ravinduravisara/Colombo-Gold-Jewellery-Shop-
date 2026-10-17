import React from "react";
import Link from "next/link";
import { Sparkles, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-luxury-ivory flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900/40 border border-gold-500/30 rounded-3xl p-8 sm:p-10 text-center space-y-6">
        <div className="text-6xl font-serif font-bold text-gold-400">404</div>

        <div className="space-y-2">
          <h2 className="text-xl font-serif font-bold text-white">Piece Not Found</h2>
          <p className="text-xs text-zinc-400">
            The page or jewellery item you are looking for may have moved or is no longer in our catalogue.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button size="sm" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Button>
          </Link>

          <Link href="/shop">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Shop</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

