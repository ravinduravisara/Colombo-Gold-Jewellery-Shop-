"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  FolderTree,
  Boxes,
  ShoppingBag,
  Users,
  CreditCard,
  Tag,
  Truck,
  MessageSquare,
  Star,
  Image as ImageIcon,
  Sliders,
  FileText,
  BarChart3,
  Search,
  Settings,
  ShieldAlert,
  LogOut,
  ExternalLink,
  ChevronRight,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface NavGroup {
  group: string;
  items: Array<{
    label: string;
    href: string;
    icon: any;
    badge?: string;
  }>;
}

const navGroups: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Sales & Reports", href: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    group: "Catalogue",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: Layers },
      { label: "Collections", href: "/admin/collections", icon: FolderTree },
      { label: "Inventory & Stock", href: "/admin/inventory", icon: Boxes },
    ],
  },
  {
    group: "Sales & Fulfilment",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
      { label: "Payments", href: "/admin/payments", icon: CreditCard },
      { label: "Coupons & Discounts", href: "/admin/coupons", icon: Tag },
      { label: "Shipping Zones", href: "/admin/shipping", icon: Truck },
    ],
  },
  {
    group: "Customer Relations",
    items: [
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Customer Reviews", href: "/admin/reviews", icon: Star },
      { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    ],
  },
  {
    group: "Marketing & Content",
    items: [
      { label: "Hero & Banners", href: "/admin/banners", icon: Sliders },
      { label: "Media & TikTok", href: "/admin/gallery", icon: ImageIcon },
      { label: "CMS Pages", href: "/admin/pages", icon: FileText },
      { label: "SEO Management", href: "/admin/seo", icon: Search },
    ],
  },
  {
    group: "Administration",
    items: [
      { label: "Store Settings", href: "/admin/settings", icon: Settings },
      { label: "Staff & Users", href: "/admin/users", icon: Users },
      { label: "Security & Audit Logs", href: "/admin/audit-logs", icon: ShieldAlert },
    ],
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-zinc-950 border-r border-zinc-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Branding */}
        <div className="h-16 px-6 border-b border-zinc-800/80 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 font-serif font-bold text-sm">
              CG
            </div>
            <div>
              <span className="font-serif font-bold text-white text-sm tracking-wide block">
                Colombo Gold
              </span>
              <span className="text-[10px] text-gold-400 tracking-wider uppercase font-semibold block">
                Admin Console
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {group.group}
              </span>
              <div className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-gold-500/15 text-gold-400 border border-gold-500/30 font-semibold"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
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
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-gold-400" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/30 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-gold-400" />
              <span>Live Storefront</span>
            </div>
            <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">
              Visit
            </span>
          </Link>

          <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between px-2">
            <div className="truncate pr-2">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-zinc-400 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

