import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, Award, Heart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us | Colombo Gold Covering Sri Lanka",
  description: "Learn about the heritage, master craftsmanship, and warranty behind Colombo Gold Covering.",
};

export default function AboutPage() {
  return (
    <div className="py-16 bg-zinc-950 min-h-screen text-luxury-ivory">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sri Lankan Jewellery Heritage</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Crafting Accessible Luxury Since Day One
          </h1>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto" />
          <p className="text-sm text-zinc-400 leading-relaxed font-light">
            Located in Sri Jayawardenepura Kotte, Colombo Gold Covering is devoted to capturing the regal brilliance of heirloom gold jewellery through modern micro-gold electroplating techniques.
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop"
              alt="Colombo Gold Covering Craftsmanship"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>

          <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
            <h2 className="text-2xl font-serif font-bold text-white">
              The Gold-Covering Difference
            </h2>
            <p>
              Unlike standard fashion jewellery that quickly discolors, our gold-covered pieces undergo an intensive multi-stage electroplating process. We deposit high microns of authentic 24K and 22K gold onto a solid hypoallergenic copper-brass alloy substrate.
            </p>
            <p>
              The result is a warm amber radiance, solid tactile weight, and skin-friendly composition that stands up to Sri Lanka&apos;s tropical climate, celebrations, and festive wear.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                <span>Heavy 24K & 22K micro gold plating for lasting luster</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                <span>Signature 6-Month warranty against tarnishing</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                <span>Dedicated re-polishing workshop in Kotte, Colombo</span>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/shop">
                <Button variant="gold" size="md">
                  Explore Our Collections
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

