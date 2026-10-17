"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  Shield,
  Sparkles,
  ChevronDown,
  Phone,
  Truck,
  Flame,
  ArrowRight,
  LogOut,
  Package,
  Gem,
  Crown,
  X,
  MapPin,
  ShieldCheck,
  Compass,
  Info,
  Camera,
  MessageCircle,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";

// Curated jewellery categories for the luxury mega menu
const MEGA_MENU_CATEGORIES = [
  {
    name: "Bridal Suites & Sets",
    href: "/shop?category=jewellery-sets",
    tagline: "Royal bridal necklaces, chokers & full wedding suites",
    badge: "Popular",
    icon: Crown,
  },
  {
    name: "Necklaces & Kasimalaya",
    href: "/shop?category=necklaces",
    tagline: "Traditional kasimalaya, thali & modern stone pendants",
    icon: Sparkles,
  },
  {
    name: "Bangles & Kappu",
    href: "/shop?category=bangles",
    tagline: "24K micro-plated daily wear, stone & wedding bangles",
    icon: Gem,
  },
  {
    name: "Earrings & Jimikkis",
    href: "/shop?category=earrings",
    tagline: "Sri Lankan bridal jhumkas, drops & elegant studs",
    badge: "Trending",
    icon: Sparkles,
  },
  {
    name: "Gold Chains & Links",
    href: "/shop?category=chains",
    tagline: "Rope chains, Figaro & durable micro-gold link chains",
    icon: Flame,
  },
  {
    name: "Rings & Bands",
    href: "/shop?category=rings",
    tagline: "Intricate wedding bands, statement & adjustable rings",
    icon: Gem,
  },
];

const SEARCH_SUGGESTIONS = [
  "Bridal Sets",
  "Kasimalaya",
  "Jimikki Earrings",
  "Daily Bangles",
  "Gold Chains",
  "Engagement Rings",
  "Choker Sets",
];

// Core commerce navigation items
const PRIMARY_NAV_ITEMS = [
  { label: "Shop All", href: "/shop" },
  { label: "Collections", href: "/collections", hasMegaMenu: true },
  { label: "New Arrivals", href: "/new-arrivals", isNew: true },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Offers", href: "/offers", isSale: true },
];

// Secondary editorial items shown directly on XL+ screens and in "More" menu on LG
const SECONDARY_NAV_ITEMS = [
  { label: "Gallery", href: "/gallery", icon: Camera, desc: "TikTok videos & real customer styles" },
  { label: "About", href: "/about", icon: Info, desc: "Our heritage, craft & Kotte atelier" },
  { label: "Contact", href: "/contact", icon: MessageCircle, desc: "Showroom visit, hotline & inquiries" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();
  const { items: cartItems, fetchCart, setIsOpen: setCartOpen } = useCartStore();
  const { items: wishlistItems, fetchWishlist } = useWishlistStore();
  const { setMobileMenuOpen } = useUIStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Dropdown states
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const megaMenuTimeout = useRef<NodeJS.Timeout | null>(null);
  const moreMenuTimeout = useRef<NodeJS.Timeout | null>(null);
  const accountTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    checkAuth();
    fetchCart();
    fetchWishlist();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [checkAuth, fetchCart, fetchWishlist]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // Close menus on route change
  useEffect(() => {
    setIsMegaMenuOpen(false);
    setIsMoreMenuOpen(false);
    setIsAccountOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Handle ESC key for search modal and menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMegaMenuOpen(false);
        setIsMoreMenuOpen(false);
        setIsAccountOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const executeQuickSearch = (term: string) => {
    router.push(`/shop?search=${encodeURIComponent(term)}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  // Mega menu hover helpers
  const handleMegaMenuEnter = () => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setIsMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimeout.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 200);
  };

  // More menu hover helpers
  const handleMoreMenuEnter = () => {
    if (moreMenuTimeout.current) clearTimeout(moreMenuTimeout.current);
    setIsMoreMenuOpen(true);
  };

  const handleMoreMenuLeave = () => {
    moreMenuTimeout.current = setTimeout(() => {
      setIsMoreMenuOpen(false);
    }, 200);
  };

  // Account menu hover helpers
  const handleAccountEnter = () => {
    if (accountTimeout.current) clearTimeout(accountTimeout.current);
    setIsAccountOpen(true);
  };

  const handleAccountLeave = () => {
    accountTimeout.current = setTimeout(() => {
      setIsAccountOpen(false);
    }, 200);
  };

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const wishlistCount = wishlistItems.length;

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* 1. Ultra-Refined Top Micro Bar */}
      <div className="bg-zinc-950/95 border-b border-white/[0.06] text-zinc-400 text-[11px] py-1.5 px-3 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          {/* Left Highlights */}
          <div className="flex items-center gap-2.5 sm:gap-3 truncate">
            <div className="flex items-center gap-1.5 text-gold-400/95 font-medium tracking-wide shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse-subtle shrink-0" />
              <span>Sri Lanka&apos;s Premier 24K Micro Gold-Covering</span>
            </div>
            <span className="hidden md:inline text-zinc-700">|</span>
            <div className="hidden md:flex items-center gap-1.5 text-zinc-400 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-500/80 shrink-0" />
              <span>6-Month Guarantee & Lifetime Re-polishing</span>
            </div>
            <span className="hidden 2xl:inline text-zinc-700">|</span>
            <div className="hidden 2xl:flex items-center gap-1.5 text-zinc-400 shrink-0">
              <Truck className="w-3.5 h-3.5 text-gold-500/80 shrink-0" />
              <span>Islandwide Cash on Delivery</span>
            </div>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-medium shrink-0 ml-auto">
            <Link
              href="/track-order"
              className="hidden sm:flex items-center gap-1 text-zinc-400 hover:text-gold-300 transition-colors shrink-0"
            >
              <Package className="w-3.5 h-3.5 text-gold-400/80 shrink-0" />
              <span>Track Order</span>
            </Link>

            <span className="hidden sm:inline text-zinc-700">|</span>

            <a
              href={`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                "Hello Colombo Gold Covering! I would like to inquire about your jewellery collection."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-gold-400 hover:text-gold-300 transition-colors font-medium shrink-0"
            >
              <Phone className="w-3 h-3 text-gold-400 shrink-0" />
              <span className="hidden md:inline">Hotline / WhatsApp:</span>
              <span>{SITE_CONFIG.formattedWhatsApp}</span>
            </a>

            <span className="hidden xl:inline text-zinc-700">|</span>

            <span className="hidden xl:flex items-center gap-1 text-zinc-500 shrink-0">
              <MapPin className="w-3 h-3 text-gold-500/70 shrink-0" />
              <span>Kotte Showroom</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Luxury Desktop & Mobile Header */}
      <div
        className={`w-full bg-zinc-950/95 backdrop-blur-xl border-b border-gold-500/20 transition-all duration-300 relative ${
          isScrolled
            ? "py-2 shadow-2xl shadow-black/80 ring-1 ring-gold-500/10"
            : "py-3"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between gap-2 lg:gap-3 xl:gap-6 w-full">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-zinc-300 hover:text-gold-400 hover:bg-zinc-900/60 focus:outline-none transition-colors shrink-0"
              aria-label="Toggle mobile navigation"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo Lockup */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-2.5 xl:gap-3 group select-none shrink-0"
              aria-label="Colombo Gold Covering Home"
            >
              {/* Luxury Jewel Emblem */}
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 xl:w-10 xl:h-10 rounded-xl bg-gradient-to-br from-gold-300 via-gold-500 to-gold-700 p-[1px] shadow-gold/25 group-hover:shadow-gold transition-all duration-300 shrink-0">
                <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center relative overflow-hidden group-hover:bg-zinc-900 transition-colors">
                  <div className="absolute inset-0 bg-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Gem className="w-4 h-4 xl:w-5 xl:h-5 text-gold-400 group-hover:scale-110 group-hover:text-gold-300 transition-all duration-300" />
                </div>
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col text-left">
                <span className="text-sm sm:text-base xl:text-lg font-serif font-bold tracking-[0.18em] xl:tracking-[0.22em] uppercase bg-gradient-to-r from-amber-100 via-gold-300 to-amber-200 bg-clip-text text-transparent group-hover:brightness-125 transition-all">
                  Colombo Gold
                </span>
                <span className="text-[8px] sm:text-[8.5px] xl:text-[9.5px] uppercase tracking-[0.32em] xl:tracking-[0.36em] text-zinc-400 font-sans font-medium -mt-1 group-hover:text-gold-300/80 transition-colors">
                  Covering &middot; Kotte
                </span>
              </div>
            </Link>

            {/* 3. Modern Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1.5 2xl:space-x-2">
              {/* Primary Commerce Links */}
              {PRIMARY_NAV_ITEMS.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                const isCollections = link.hasMegaMenu;

                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={isCollections ? handleMegaMenuEnter : undefined}
                    onMouseLeave={isCollections ? handleMegaMenuLeave : undefined}
                  >
                    <Link
                      href={link.href}
                      className={`relative px-2 xl:px-2.5 2xl:px-3 py-1.5 text-xs xl:text-[13px] font-medium tracking-normal xl:tracking-wide rounded-full transition-all duration-200 flex items-center gap-1 xl:gap-1.5 whitespace-nowrap group ${
                        isActive
                          ? "text-gold-400 bg-gold-500/10 shadow-sm"
                          : "text-zinc-300 hover:text-gold-300 hover:bg-white/[0.04]"
                      }`}
                    >
                      <span>{link.label}</span>

                      {/* Collections Chevron Indicator */}
                      {isCollections && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-gold-400 transition-transform duration-200 ${
                            isMegaMenuOpen ? "rotate-180 text-gold-400" : ""
                          }`}
                        />
                      )}

                      {/* Offers "SALE" Luxury Badge */}
                      {link.isSale && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm ring-1 ring-gold-400/30 animate-pulse-subtle">
                          Sale
                        </span>
                      )}

                      {/* New Arrivals Spark Badge */}
                      {link.isNew && (
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 ring-2 ring-gold-400/40 animate-ping" />
                      )}

                      {/* Active Underline Glow */}
                      {isActive && (
                        <span className="absolute -bottom-1 left-2.5 right-2.5 h-[2px] bg-gradient-to-r from-gold-400 to-gold-600 rounded-full shadow-gold" />
                      )}
                    </Link>
                  </div>
                );
              })}

              {/* Secondary Links: Directly visible on XL screens */}
              <div className="hidden xl:flex items-center space-x-1 2xl:space-x-2">
                {SECONDARY_NAV_ITEMS.map((link) => {
                  const isActive = pathname === link.href || pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative px-2 xl:px-2.5 2xl:px-3 py-1.5 text-xs xl:text-[13px] font-medium tracking-normal xl:tracking-wide rounded-full transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap group ${
                        isActive
                          ? "text-gold-400 bg-gold-500/10 shadow-sm"
                          : "text-zinc-300 hover:text-gold-300 hover:bg-white/[0.04]"
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="absolute -bottom-1 left-2.5 right-2.5 h-[2px] bg-gradient-to-r from-gold-400 to-gold-600 rounded-full shadow-gold" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* "More ▾" Menu for LG screens (1024px - 1279px) to guarantee zero clipping */}
              <div
                className="relative xl:hidden"
                onMouseEnter={handleMoreMenuEnter}
                onMouseLeave={handleMoreMenuLeave}
              >
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className={`px-2 py-1.5 text-xs font-medium rounded-full transition-all duration-200 flex items-center gap-1 whitespace-nowrap ${
                    isMoreMenuOpen
                      ? "text-gold-400 bg-gold-500/10"
                      : "text-zinc-300 hover:text-gold-300 hover:bg-white/[0.04]"
                  }`}
                >
                  <span>More</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${
                      isMoreMenuOpen ? "rotate-180 text-gold-400" : ""
                    }`}
                  />
                </button>

                {/* More Dropdown Menu */}
                {isMoreMenuOpen && (
                  <div
                    className="absolute left-0 top-full pt-2 w-64 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseEnter={handleMoreMenuEnter}
                    onMouseLeave={handleMoreMenuLeave}
                  >
                    <div className="bg-zinc-950/95 backdrop-blur-xl border border-gold-500/30 rounded-2xl p-2.5 shadow-2xl shadow-black ring-1 ring-gold-500/10">
                      {SECONDARY_NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isItemActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-start gap-2.5 p-2 rounded-xl transition-all ${
                              isItemActive
                                ? "bg-gold-500/15 text-gold-300"
                                : "hover:bg-zinc-900 text-zinc-300 hover:text-gold-300"
                            }`}
                          >
                            <div className="w-7 h-7 rounded-lg bg-zinc-850 flex items-center justify-center text-gold-400 shrink-0 mt-0.5">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold">{item.label}</span>
                              <span className="text-[10px] text-zinc-400">{item.desc}</span>
                            </div>
                          </Link>
                        );
                      })}

                      <div className="mt-1 pt-1 border-t border-zinc-800">
                        <Link
                          href="/warranty"
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-gold-300 hover:bg-zinc-900 transition-colors"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                          <span>6-Month Warranty Policy</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* 4. Right Action Suite - GUARANTEED FULLY VISIBLE & NON-SHRINKING */}
            <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-3 shrink-0 flex-none ml-auto">
              {/* Search Trigger Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-8 h-8 sm:w-9 sm:h-9 xl:w-10 xl:h-10 rounded-full flex items-center justify-center bg-zinc-900/60 hover:bg-gold-500/10 border border-zinc-800 hover:border-gold-500/40 text-zinc-300 hover:text-gold-300 transition-all duration-200 shrink-0"
                aria-label="Search jewellery catalogue"
                title="Search jewellery catalogue"
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Wishlist Button */}
              <Link
                href="/account/wishlist"
                className="w-8 h-8 sm:w-9 sm:h-9 xl:w-10 xl:h-10 rounded-full flex items-center justify-center bg-zinc-900/60 hover:bg-gold-500/10 border border-zinc-800 hover:border-gold-500/40 text-zinc-300 hover:text-gold-300 transition-all duration-200 relative group shrink-0"
                aria-label="View wishlist"
                title="View wishlist"
              >
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 text-black text-[9px] font-extrabold shadow-gold ring-2 ring-zinc-950">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag / Cart Trigger */}
              <button
                onClick={() => setCartOpen(true)}
                className="w-8 h-8 sm:w-9 sm:h-9 xl:w-10 xl:h-10 rounded-full flex items-center justify-center bg-zinc-900/60 hover:bg-gold-500/10 border border-zinc-800 hover:border-gold-500/40 text-zinc-300 hover:text-gold-300 transition-all duration-200 relative group shrink-0"
                aria-label="Open shopping cart"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 text-black text-[9px] font-extrabold shadow-gold ring-2 ring-zinc-950 animate-pulse-subtle">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Account / Sign In - 100% VISIBLE & NON-WRAPPING */}
              {mounted && isAuthenticated ? (
                <div
                  className="relative shrink-0"
                  onMouseEnter={handleAccountEnter}
                  onMouseLeave={handleAccountLeave}
                >
                  <button
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 pl-1.5 pr-2.5 sm:pl-2 sm:pr-3 py-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800/90 border border-gold-500/30 hover:border-gold-500/60 transition-all text-xs text-zinc-200 group whitespace-nowrap shrink-0"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-gold-600 to-gold-400 text-black font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="max-w-[80px] sm:max-w-[90px] truncate font-medium">
                      {user?.name ? user.name.split(" ")[0] : "Account"}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-gold-400 transition-transform shrink-0 ${
                        isAccountOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Account Luxury Dropdown Menu */}
                  {isAccountOpen && (
                    <div
                      className="absolute right-0 top-full pt-2 w-56 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onMouseEnter={handleAccountEnter}
                      onMouseLeave={handleAccountLeave}
                    >
                      <div className="bg-zinc-950/95 backdrop-blur-xl border border-gold-500/30 rounded-2xl p-2 shadow-2xl shadow-black ring-1 ring-gold-500/10">
                        {/* User Header Info */}
                        <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                          <p className="text-xs font-semibold text-white truncate">
                            {user?.name}
                          </p>
                          <p className="text-[10px] text-zinc-400 truncate">
                            {user?.email}
                          </p>
                        </div>

                        <Link
                          href="/account"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-gold-300 hover:bg-gold-500/10 transition-colors"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-gold-400" />
                          <span>My Account</span>
                        </Link>

                        <Link
                          href="/account/orders"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-gold-300 hover:bg-gold-500/10 transition-colors"
                        >
                          <Package className="w-3.5 h-3.5 text-gold-400" />
                          <span>Order History</span>
                        </Link>

                        <Link
                          href="/account/wishlist"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-gold-300 hover:bg-gold-500/10 transition-colors"
                        >
                          <Heart className="w-3.5 h-3.5 text-gold-400" />
                          <span>Wishlist ({wishlistCount})</span>
                        </Link>

                        <Link
                          href="/track-order"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-gold-300 hover:bg-gold-500/10 transition-colors"
                        >
                          <Truck className="w-3.5 h-3.5 text-gold-400" />
                          <span>Track Order</span>
                        </Link>

                        {/* Admin Shortcut */}
                        {user && (user.role === "admin" || user.role === "superadmin") && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-400 hover:bg-amber-500/10 transition-colors"
                          >
                            <Shield className="w-3.5 h-3.5" />
                            <span>Admin Portal</span>
                          </Link>
                        )}

                        <div className="pt-1 mt-1 border-t border-zinc-800/80">
                          <button
                            onClick={logout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:brightness-110 text-zinc-950 shadow-gold hover:shadow-gold-lg transition-all duration-200 whitespace-nowrap active:scale-95 shrink-0"
                >
                  <UserIcon className="w-3.5 h-3.5 text-zinc-950 shrink-0" />
                  <span className="shrink-0">Sign In</span>
                </Link>
              )}

              {/* Admin Portal Quick Shortcut (Icon) if Admin */}
              {mounted && user && (user.role === "admin" || user.role === "superadmin") && (
                <Link
                  href="/admin"
                  className="hidden 2xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-all shrink-0"
                  title="Open Admin Dashboard"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>

          {/* 5. Centered Mega Menu Dropdown for Collections */}
          {isMegaMenuOpen && (
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[740px] max-w-[calc(100vw-2rem)] z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
            >
              <div className="bg-zinc-950/95 backdrop-blur-2xl border border-gold-500/30 rounded-2xl p-6 shadow-2xl shadow-black ring-1 ring-gold-500/10">
                {/* Mega Menu Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-850">
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.25em] font-serif font-bold text-gold-400">
                      Explore Jewellery Categories
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Handcrafted 24K micro gold-covered suites & ornaments
                    </p>
                  </div>
                  <Link
                    href="/collections"
                    className="text-xs text-gold-400 hover:text-gold-300 font-medium flex items-center gap-1 group/link"
                  >
                    <span>View All Collections</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Grid Layout: Categories + Featured Spotlight */}
                <div className="grid grid-cols-12 gap-5">
                  {/* Left: 6 Category Cards */}
                  <div className="col-span-8 grid grid-cols-2 gap-2.5">
                    {MEGA_MENU_CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          className="group/item flex items-start gap-3 p-2.5 rounded-xl bg-zinc-900/40 hover:bg-gold-500/10 border border-zinc-800/80 hover:border-gold-500/30 transition-all duration-200"
                        >
                          <div className="w-8 h-8 rounded-lg bg-zinc-800/80 group-hover/item:bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-zinc-200 group-hover/item:text-gold-300 transition-colors truncate">
                                {cat.name}
                              </span>
                              {cat.badge && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-gold-500/20 text-gold-400 border border-gold-500/30 shrink-0">
                                  {cat.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                              {cat.tagline}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Right: Featured Showcase Card */}
                  <div className="col-span-4 relative rounded-xl overflow-hidden border border-gold-500/30 bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 flex flex-col justify-between group/banner">
                    <div className="relative z-10">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-gold-500 text-black mb-2">
                        Bridal 2026
                      </span>
                      <h5 className="font-serif font-bold text-sm text-gold-200 leading-snug">
                        Royal Heritage Bridal Suites
                      </h5>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                        Lifetime re-polishing warranty on wedding collections.
                      </p>
                    </div>

                    <Link
                      href="/collections/bridal-elegance-2026"
                      className="relative z-10 mt-4 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-gold-500/20 hover:bg-gold-500 text-gold-300 hover:text-black border border-gold-500/40 transition-all text-center"
                    >
                      <span>Browse Bridal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Bottom Guarantee Banner */}
                <div className="mt-4 pt-3 border-t border-zinc-850 flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    Guaranteed 24K Micro Gold Electroplate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    Fast Express Delivery Islandwide
                  </span>
                  <Link
                    href="/warranty"
                    className="text-gold-400 hover:text-gold-300 underline underline-offset-2 shrink-0"
                  >
                    Warranty Policy
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. Modern Glassmorphic Search Overlay / Modal */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 sm:pt-28 px-4 animate-in fade-in duration-200"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-zinc-950/95 border border-gold-500/40 rounded-2xl p-6 shadow-2xl shadow-gold/10 ring-1 ring-gold-500/20 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-4 w-5 h-5 text-gold-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search necklaces, bangles, bridal suites, jimikkis, rings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-13 pl-12 pr-28 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-gold-500 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 shadow-inner"
              />
              <div className="absolute right-2 top-2 flex items-center gap-1.5">
                <button
                  type="submit"
                  className="h-9 px-4 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-zinc-950 font-bold text-xs transition-all shadow-sm"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Trending Quick Suggestions */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2.5">
                <span className="flex items-center gap-1.5 font-medium text-gold-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  Popular Searches
                </span>
                <span className="text-[11px] text-zinc-500">Press ESC to exit</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SEARCH_SUGGESTIONS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => executeQuickSearch(term)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-900/90 hover:bg-gold-500/20 border border-zinc-800 hover:border-gold-500/40 text-zinc-300 hover:text-gold-300 transition-all duration-150"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Browse Links */}
            <div className="mt-5 pt-4 border-t border-zinc-850 flex items-center justify-between text-xs">
              <span className="text-zinc-500">Need inspiration?</span>
              <div className="flex items-center gap-3">
                <Link
                  href="/new-arrivals"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-zinc-300 hover:text-gold-400 transition-colors"
                >
                  New Arrivals &rarr;
                </Link>
                <Link
                  href="/best-sellers"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-zinc-300 hover:text-gold-400 transition-colors"
                >
                  Best Sellers &rarr;
                </Link>
                <Link
                  href="/offers"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                >
                  Special Offers &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
