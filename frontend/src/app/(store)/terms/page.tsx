import React from "react";
import { ShieldCheck } from "lucide-react";
import { api } from "@/services/api";

export const metadata = {
  title: "Terms & Conditions | Colombo Gold Covering",
  description: "Terms and conditions for orders, pricing, and deliveries.",
};

export default async function TermsPage() {
  let content = null;
  try {
    const res = await api.get("/content/terms");
    content = res.data.data;
  } catch {}

  return (
    <div className="py-16 bg-zinc-950 min-h-screen text-luxury-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-400 font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Store Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Terms &amp; Conditions
          </h1>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
        </div>

        {content?.content ? (
          <div className="prose prose-invert max-w-none text-sm text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: content.content }} />
        ) : (
          <div className="space-y-6 text-sm text-zinc-300 leading-relaxed rounded-3xl bg-zinc-900/30 border border-zinc-850 p-8 sm:p-12">
            <h2 className="text-lg font-serif font-bold text-white">1. Scope of Agreement</h2>
            <p>
              By accessing the Colombo Gold Covering website, browsing our product collections, placing orders online, or ordering via our verified WhatsApp hotline (+94 77 123 4567), you agree to these Terms and Conditions.
            </p>

            <h2 className="text-lg font-serif font-bold text-white pt-4">2. Pricing &amp; Currency</h2>
            <p>
              All prices shown on this website are listed in Sri Lankan Rupees (LKR). While we strive for accuracy, in the event of an inadvertent pricing error, Colombo Gold Covering reserves the right to cancel or amend affected orders before dispatch with full notification to the customer.
            </p>

            <h2 className="text-lg font-serif font-bold text-white pt-4">3. Delivery &amp; Cash on Delivery (COD)</h2>
            <p>
              We provide delivery across all 25 Sri Lankan districts through registered courier partners. For Cash on Delivery orders, the exact invoice amount must be handed over to the courier personnel upon parcel receipt.
            </p>

            <h2 className="text-lg font-serif font-bold text-white pt-4">4. Jewellery Nature &amp; Care</h2>
            <p>
              Our jewellery consists of micro-gold electroplated layers over alloy cores. While highly durable, customers must adhere to our provided care instructions (avoiding direct perfume/chemical contact) to maintain the finish throughout and beyond the 6-month warranty term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

