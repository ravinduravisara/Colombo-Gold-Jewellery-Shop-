"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-gold-500/20 text-zinc-400 text-sm">
      {/* Trust Highlights Section */}
      <div className="border-b border-zinc-900 bg-zinc-900/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">6-Month Guarantee</h4>
                <p className="text-xs text-zinc-500">Premium gold-covering guarantee against tarnishing</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Islandwide Delivery</h4>
                <p className="text-xs text-zinc-500">Prompt courier delivery to all 25 districts</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Re-Polishing Service</h4>
                <p className="text-xs text-zinc-500">Dedicated re-plating & maintenance in Kotte</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">24K / 22K Micro Plated</h4>
                <p className="text-xs text-zinc-500">Authentic gold luster & heirloom durability</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-serif font-bold text-gold-400 tracking-wider uppercase">
                Colombo Gold Covering
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Sri Lanka&apos;s trusted destination for high-micron gold-covered and gold-plated jewellery. Handcrafted bridal sets, traditional necklaces, bangles, and daily glamour backed by our warranty and master re-polishing.
            </p>

            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>{SITE_CONFIG.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-white transition-colors">
                  {SITE_CONFIG.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-white transition-colors">
                  {SITE_CONFIG.email}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Collections</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/category/necklaces" className="hover:text-gold-400 transition-colors">
                  Necklaces & Chokers
                </Link>
              </li>
              <li>
                <Link href="/category/earrings" className="hover:text-gold-400 transition-colors">
                  Traditional Jimikkis
                </Link>
              </li>
              <li>
                <Link href="/category/bangles" className="hover:text-gold-400 transition-colors">
                  Bangles & Kada Pairs
                </Link>
              </li>
              <li>
                <Link href="/category/jewellery-sets" className="hover:text-gold-400 transition-colors">
                  Bridal Suites
                </Link>
              </li>
              <li>
                <Link href="/category/chains" className="hover:text-gold-400 transition-colors">
                  Micro Gold Chains
                </Link>
              </li>
              <li>
                <Link href="/category/rings" className="hover:text-gold-400 transition-colors">
                  Statement Rings
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/track-order" className="hover:text-gold-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-gold-400 transition-colors">
                  Warranty & Guarantee
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-400 transition-colors">
                  Contact & Showroom
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-gold-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & TikTok Connect */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Follow Us</h4>
            <p className="text-xs text-zinc-400">
              Watch our latest jewellery showcases, polish tests, and behind-the-scenes craft on TikTok:
            </p>
            <a
              href={SITE_CONFIG.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-gold-500/50 text-white text-xs font-semibold transition-all hover:bg-zinc-850"
            >
              <span className="text-gold-400">TikTok</span>
              <span>{SITE_CONFIG.tiktokHandle}</span>
            </a>

            <div className="pt-2">
              <span className="block text-xs text-zinc-500 mb-2">Accepted Payments</span>
              <div className="flex flex-wrap gap-2 text-[10px] font-medium text-zinc-300">
                <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800">Cash on Delivery</span>
                <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800">Bank Transfer</span>
                <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800">Commercial Bank</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Colombo Gold Covering. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="hover:text-zinc-300">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-zinc-300">
              Terms
            </Link>
            <Link href="/warranty" className="hover:text-zinc-300">
              Warranty
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

