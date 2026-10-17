"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ShieldCheck, Printer, MessageCircle, ArrowRight, Package } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "CGC-202610-8291";
  const customerEmail = searchParams.get("email") || "";

  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#C6A667", "#DFCA95", "#FAF8F3", "#FFFFFF"],
      });
    } catch {}
  }, []);

  const whatsappMsg = encodeURIComponent(
    `Hello Colombo Gold Covering! I just placed order *${orderNumber}*. Could you please confirm delivery details and dispatch status?`
  );
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${whatsappMsg}`;

  return (
    <div className="py-20 bg-zinc-950 min-h-screen text-luxury-ivory flex items-center justify-center px-4">
      <div className="max-w-xl w-full rounded-3xl bg-zinc-900/40 border border-gold-500/30 p-8 sm:p-12 text-center space-y-8 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,166,103,0.08)_0,transparent_70%)] pointer-events-none" />

        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
            Order Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Thank You for Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Your jewellery order has been submitted successfully and is being prepared for dispatch.
          </p>
        </div>

        {/* Order Reference Card */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
          <span className="text-xs text-zinc-500 uppercase tracking-wider block">Your Order Reference Number</span>
          <span className="text-2xl font-mono font-bold text-gold-400 tracking-wider block select-all">
            {orderNumber}
          </span>
          {customerEmail && (
            <p className="text-xs text-zinc-400 pt-1">
              A confirmation email has been dispatched to <strong>{customerEmail}</strong>.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/track-order?orderNumber=${orderNumber}`} className="flex-1">
              <Button variant="gold" size="md" className="w-full">
                <Package className="w-4 h-4 mr-2" />
                Track Order
              </Button>
            </Link>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button
                variant="outline"
                size="md"
                className="w-full border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Follow-up
              </Button>
            </a>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white pt-2 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Order Invoice
          </button>
        </div>

        {/* Warranty reminder */}
        <div className="pt-4 border-t border-zinc-850 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-gold-400" />
          <span>Includes Official 6-Month Colombo Gold Covering Warranty Certificate</span>
        </div>
      </div>
    </div>
  );
}

