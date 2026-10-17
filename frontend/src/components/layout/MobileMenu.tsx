"use client";

import React from "react";
import Link from "next/link";
import { X, Phone, MessageCircle, Heart, ShoppingBag, ShieldCheck } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";

export function MobileMenu() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isMobileMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-zinc-950 border-l border-zinc-800 p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xl font-serif font-bold text-gold-400">
                COLOMBO GOLD
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="mt-6 flex flex-col space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-zinc-300 hover:text-gold-400 py-1 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-zinc-850 flex flex-col space-y-3">
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 text-sm text-zinc-400 hover:text-gold-400 py-1"
              >
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                Track Order
              </Link>
              <Link
                href="/account/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 text-sm text-zinc-400 hover:text-gold-400 py-1"
              >
                <Heart className="w-4 h-4 text-gold-400" />
                My Wishlist
              </Link>
            </div>
          </nav>
        </div>

        {/* Footer / Account / Social */}
        <div className="pt-6 border-t border-zinc-850 space-y-4">
          {isAuthenticated ? (
            <div className="space-y-2">
              <p className="text-xs text-zinc-400">Signed in as</p>
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <div className="flex gap-2 pt-2">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 px-3 rounded bg-zinc-900 text-xs font-semibold text-gold-400 hover:bg-zinc-800"
                >
                  My Account
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 px-3 rounded bg-zinc-900 text-xs text-zinc-400 hover:text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 px-3 rounded bg-gold-500 text-black font-semibold text-xs hover:bg-gold-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 px-3 rounded border border-zinc-700 text-white font-medium text-xs hover:bg-zinc-900 transition-colors"
              >
                Register
              </Link>
            </div>
          )}

          <div className="pt-2 text-xs text-zinc-500 flex items-center justify-between">
            <a
              href={`tel:${SITE_CONFIG.phone}`}
              className="flex items-center gap-1.5 hover:text-zinc-300"
            >
              <Phone className="w-3.5 h-3.5 text-gold-500" />
              {SITE_CONFIG.phone}
            </a>
            <a
              href={SITE_CONFIG.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:underline"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

