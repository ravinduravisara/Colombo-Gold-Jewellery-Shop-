"use client";

import React from "react";
import { Star, CheckCircle, Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Chamari Wickramasinghe",
      location: "Colombo 05",
      rating: 5,
      date: "Verified Customer",
      comment:
        "The peacock bridal choker exceeded my expectations! The gold covering has the exact warm amber glow of authentic 24K gold. Wore it for my reception and received countless compliments.",
    },
    {
      name: "Nadeesha Jayawardena",
      location: "Kandy",
      rating: 5,
      date: "Verified Customer",
      comment:
        "Ordered the jimikkis and kada bangles via WhatsApp. Delivery to Kandy took just 2 days. The craftsmanship is flawless and the safety locks on the bangles are very secure.",
    },
    {
      name: "Dinusha Perera",
      location: "Gampaha",
      rating: 5,
      date: "Verified Customer",
      comment:
        "I was skeptical about ordering gold plated jewellery online, but Colombo Gold Covering's 6-month warranty and prompt customer service made me a loyal customer. Re-polishing support is fantastic!",
    },
  ];

  return (
    <section className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
            Customer Testimonials
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Loved Across Sri Lanka
          </h2>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 relative flex flex-col justify-between"
            >
              <Quote className="w-8 h-8 text-gold-500/20 mb-4" />
              <p className="text-sm text-zinc-300 leading-relaxed italic mb-6">
                &ldquo;{t.comment}&rdquo;
              </p>

              <div>
                <div className="flex gap-1 text-amber-400 mb-2">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <h4 className="text-sm font-semibold text-white">{t.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{t.date} &middot; {t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

