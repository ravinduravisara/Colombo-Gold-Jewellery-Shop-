"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App boundary error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 text-luxury-ivory flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900/40 border border-gold-500/30 rounded-3xl p-8 text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-serif font-bold text-white">Something Went Wrong</h2>
          <p className="text-xs text-zinc-400">
            We encountered an unexpected error while loading this page.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} size="sm" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>

          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

