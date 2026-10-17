"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  Shield,
  Sparkles,
} from "lucide-react";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const { items: cartItems, fetchCart, setIsOpen: setCartOpen } = useCartStore();
  const { items: wishlistItems, fetchWishlist } = useWishlistStore();
  const { setMobileMenuOpen, setQuickViewProduct } = useUIStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
    fetchCart();
    fetchWishlist();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [checkAuth, fetchCart, fetchWishlist]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchVisible(false);
    }
  };

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const wishlistCount = wishlistItems.length;

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 text-luxury-black py-2 px-4 text-center text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Islandwide Delivery Across Sri Lanka | Premium 6-Month Gold-Covering Guarantee!</span>
        <Sparkles className="w-3.5 h-3.5" />
      </div>

      {/* Main Header */}
      <div
        className={`w-full bg-zinc-950/95 backdrop-blur-md border-b border-gold-500/20 transition-all ${
          isScrolled ? "py-3 shadow-luxury-dark" : "py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-zinc-300 hover:text-gold-400 focus:outline-none"
              aria-label="Toggle mobile navigation"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex flex-col items-center text-center group">
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-widest text-gold-400 group-hover:text-gold-300 transition-colors uppercase">
                Colombo Gold
              </span>
              <span className="text-[10px] uppercase tracking-[0.28em] text-zinc-400 font-sans -mt-1 group-hover:text-gold-200">
                Covering &middot; Kotte
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-zinc-300 hover:text-gold-400 transition-colors tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-4">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchVisible(!isSearchVisible)}
                className="p-2 text-zinc-300 hover:text-gold-400 transition-colors"
                aria-label="Search jewellery catalogue"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Icon */}
              <Link
                href="/account/wishlist"
                className="relative p-2 text-zinc-300 hover:text-gold-400 transition-colors hidden sm:block"
                aria-label="View wishlist"
              >
                <Heart className="w-5 h-5" />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-gold-500 text-black text-[10px] font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Cart Trigger */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-zinc-300 hover:text-gold-400 transition-colors"
                aria-label="Open shopping cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {mounted && cartCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-gold-500 text-black text-[10px] font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Account or Auth Link */}
              {mounted && isAuthenticated ? (
                <div className="relative group">
                  <Link
                    href="/account"
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-gold-400"
                    aria-label="My Account"
                  >
                    <UserIcon className="w-5 h-5" />
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 border border-gold-500/40 text-gold-400 hover:bg-gold-500 hover:text-black transition-all"
                >
                  Sign In
                </Link>
              )}

              {/* Admin Portal Shortcut if Admin */}
              {mounted && user && (user.role === "admin" || user.role === "superadmin") && (
                <Link
                  href="/admin"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Search Bar Drawer */}
          {isSearchVisible && (
            <div className="pt-4 pb-2 border-t border-zinc-850 mt-3 animate-in slide-in-from-top-2 duration-150">
              <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Search gold-covered necklaces, bangles, jimikkis, rings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-11 pr-24 rounded-full bg-zinc-900/90 border border-gold-500/50 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  autoFocus
                />
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 h-8 px-4 rounded-full bg-gold-500 hover:bg-gold-600 text-black font-semibold text-xs transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

