"use client";

import React, { useState } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const defaultMessage = encodeURIComponent(
    "Hello Colombo Gold Covering! I am visiting your website and would like to inquire about your jewellery collections and custom orders."
  );

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Floating Popup Trigger */}
      {isOpen && (
        <div className="mb-3 w-80 rounded-2xl bg-zinc-950 border border-gold-500/40 p-5 shadow-2xl text-luxury-ivory animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-semibold text-gold-400">Colombo Gold Covering</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="mt-3 text-xs text-zinc-300 leading-relaxed">
            Need styling advice, size recommendations, or want to order directly from TikTok? Chat with our jewellery experts!
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors shadow-lg shadow-emerald-950/50"
          >
            <MessageCircle className="w-4 h-4" />
            Start WhatsApp Chat
          </a>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
        aria-label="Open WhatsApp conversation"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="sr-only">Contact us on WhatsApp</span>
        
        {/* Glow halo */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-gold-500 text-[9px] font-bold text-black items-center justify-center">1</span>
        </span>
      </button>
    </div>
  );
}

