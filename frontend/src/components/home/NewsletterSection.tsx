"use client";

import React, { useState } from "react";
import { Sparkles, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 border-t border-zinc-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>VIP Jewellery Club</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
          Join the Colombo Gold Inner Circle
        </h2>

        <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Be the first to preview new bridal arrivals, exclusive seasonal promotions, and insider gold-care advice. Receive Rs. 500 off your initial order.
        </p>

        {isSubmitted ? (
          <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm max-w-md mx-auto">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Thank you for joining! Use promo code <strong>WELCOME500</strong> at checkout.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
              />
            </div>
            <Button type="submit" variant="gold" size="md" className="shrink-0">
              Subscribe Now
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

