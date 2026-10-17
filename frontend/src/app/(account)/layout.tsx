"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/account", icon: User },
  { label: "My Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Profile Settings", href: "/account/profile", icon: Settings },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-gold-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm tracking-widest uppercase font-serif text-zinc-400">
            Loading Account...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isAdmin =
    user.role === "admin" || user.role === "superadmin" || user.role === "staff";

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-luxury-ivory selection:bg-gold-500/30 selection:text-gold-200">
      <Header />
      <CartDrawer />
      <WhatsAppButton />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8 border-b border-zinc-800/80 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
              Welcome, {user.name}
            </h1>
            <p className="text-sm text-zinc-400 mt-0.5">{user.email}</p>
          </div>

          {isAdmin && (
            <Link href="/admin">
              <Button
                variant="outline"
                className="border-gold-500/40 text-gold-400 hover:bg-gold-500/10 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Console</span>
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-1 space-y-3">
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-3 sm:p-4 backdrop-blur-sm space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gold-500/15 text-gold-400 border border-gold-500/30 font-semibold shadow-sm"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-gold-400" : "text-zinc-400"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-gold-400" />}
                  </Link>
                );
              })}

              <div className="pt-3 mt-3 border-t border-zinc-800/60">
                <button
                  onClick={async () => {
                    await logout();
                    router.push("/login");
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400/90 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="lg:col-span-3">
            {children}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
