"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  MapPin,
  Heart,
  ChevronRight,
  Clock,
  Package,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { orderService } from "@/services/orderService";
import { IOrder } from "@/types/order";
import { formatLKR } from "@/lib/formatCurrency";
import { Button } from "@/components/ui/button";

export default function AccountOverviewPage() {
  const { user } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const [recentOrders, setRecentOrders] = useState<IOrder[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    async function loadRecentOrders() {
      try {
        setIsLoadingOrders(true);
        const data = await orderService.getMyOrders(1);
        setRecentOrders(data.orders?.slice(0, 3) || []);
        setTotalOrders(data.meta?.total || (data.orders ? data.orders.length : 0));
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setIsLoadingOrders(false);
      }
    }
    loadRecentOrders();
  }, []);

  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  return (
    <div className="space-y-8">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              Total Orders
            </span>
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-white mt-3">{totalOrders}</p>
          <Link
            href="/account/orders"
            className="text-xs text-gold-400 hover:text-gold-300 mt-2 inline-flex items-center gap-1 font-medium"
          >
            <span>View all orders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              Saved In Wishlist
            </span>
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-white mt-3">
            {wishlistItems.length}
          </p>
          <Link
            href="/account/wishlist"
            className="text-xs text-gold-400 hover:text-gold-300 mt-2 inline-flex items-center gap-1 font-medium"
          >
            <span>Explore wishlist</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
              Saved Addresses
            </span>
            <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-white mt-3">
            {user?.addresses?.length || 0}
          </p>
          <Link
            href="/account/addresses"
            className="text-xs text-gold-400 hover:text-gold-300 mt-2 inline-flex items-center gap-1 font-medium"
          >
            <span>Manage addresses</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div>
            <h2 className="text-lg font-serif font-bold text-white">Recent Orders</h2>
            <p className="text-xs text-zinc-400">Check tracking & fulfillment status</p>
          </div>
          <Link href="/account/orders">
            <Button variant="ghost" size="sm" className="text-gold-400 hover:text-gold-300">
              View All
            </Button>
          </Link>
        </div>

        {isLoadingOrders ? (
          <div className="py-8 text-center text-zinc-500 text-sm">Loading recent orders...</div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <Package className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 text-sm">You haven&apos;t placed any orders yet.</p>
            <Link href="/shop">
              <Button size="sm">Browse Jewellery Catalogue</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">
                      #{order.orderNumber}
                    </span>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full capitalize font-medium ${
                        order.orderStatus === "delivered"
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                          : order.orderStatus === "cancelled"
                          ? "bg-red-950/60 text-red-400 border border-red-500/30"
                          : "bg-amber-950/60 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span>{order.items.length} item(s)</span>
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="text-xs text-zinc-400">Total:</span>
                    <p className="font-serif font-bold text-gold-400 text-sm">
                      {formatLKR(order.totalAmount)}
                    </p>
                  </div>
                  <Link href={`/account/orders?id=${order._id}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Details & Default Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h3 className="font-serif font-semibold text-white">Profile Summary</h3>
            <Link href="/account/profile">
              <span className="text-xs text-gold-400 hover:text-gold-300 font-medium">Edit</span>
            </Link>
          </div>
          <div className="space-y-2 text-sm text-zinc-300">
            <div>
              <span className="text-xs text-zinc-500 block uppercase font-medium">Name</span>
              <span>{user?.name}</span>
            </div>
            <div>
              <span className="text-xs text-zinc-500 block uppercase font-medium">Email</span>
              <span>{user?.email}</span>
            </div>
            <div>
              <span className="text-xs text-zinc-500 block uppercase font-medium">Phone</span>
              <span>{user?.phone || "Not provided"}</span>
            </div>
          </div>
        </div>

        {/* Primary Shipping Address */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h3 className="font-serif font-semibold text-white">Default Address</h3>
            <Link href="/account/addresses">
              <span className="text-xs text-gold-400 hover:text-gold-300 font-medium">
                {defaultAddress ? "Change" : "Add Address"}
              </span>
            </Link>
          </div>
          {defaultAddress ? (
            <div className="text-sm text-zinc-300 space-y-1">
              <p className="font-medium text-white">{defaultAddress.fullName}</p>
              <p>{defaultAddress.addressLine1}</p>
              {defaultAddress.addressLine2 && <p>{defaultAddress.addressLine2}</p>}
              <p>
                {defaultAddress.city}, {defaultAddress.district}
              </p>
              <p className="text-xs text-zinc-400 mt-1">Phone: {defaultAddress.phone}</p>
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-xs text-zinc-500 mb-2">No delivery address saved yet.</p>
              <Link href="/account/addresses">
                <Button size="sm" variant="outline">
                  Add Delivery Address
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

