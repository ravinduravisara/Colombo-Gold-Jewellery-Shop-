"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Menu, Bell, Shield, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const getPageTitle = () => {
    if (pathname === "/admin") return "Executive Dashboard";
    const segment = pathname.split("/admin/")[1]?.split("/")[0];
    if (!segment) return "Admin Console";
    return segment
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="font-serif font-bold text-base sm:text-lg text-white">
            {getPageTitle()}
          </h1>
          <p className="text-[10px] text-zinc-400 hidden sm:block">
            Colombo Gold Covering Management System
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* System Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>System Online</span>
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 font-bold text-xs uppercase">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-semibold text-white block leading-tight">
              {user?.name}
            </span>
            <span className="text-[10px] text-gold-400/90 capitalize block font-medium">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

