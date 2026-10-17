import React from "react";
import Link from "next/link";
import { Sparkles, HelpCircle, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { api } from "@/services/api";

export const metadata = {
  title: "Frequently Asked Questions | Colombo Gold Covering",
  description: "Common questions about gold covering durability, orders, payments, and delivery.",
};

export default async function FAQPage() {
  let content = null;
  try {
    const res = await api.get("/content/faq");
    content = res.data.data;
  } catch {}

  const defaultFaqs = [
    {
      q: "What is Gold Covering (Micro Gold Plating)?",
      a: "Gold covering is an advanced electroplating process where heavy layers of authentic 24K or 22K gold are bonded onto a solid hypoallergenic base metal. It possesses the exact luster, amber hue, and feel of solid gold without the exorbitant price.",
    },
    {
      q: "How does the 6-Month Warranty work?",
      a: "Every piece comes with our official warranty certificate. If your jewellery experiences abnormal discoloration or plating peel under normal usage within 6 months, we will re-plate it free of charge at our workshop.",
    },
    {
      q: "Can I order directly through WhatsApp?",
      a: "Yes! Every product page features an 'Order via WhatsApp' button that compiles your chosen product name, SKU, variant, and quantity into a message. Send it to +94 77 123 4567 and our staff will confirm your order.",
    },
    {
      q: "What payment methods are supported?",
      a: "We accept Cash on Delivery (COD) islandwide across all 25 Sri Lankan districts, as well as Direct Bank Transfers to our Commercial Bank of Ceylon business account.",
    },
    {
      q: "How fast is delivery?",
      a: "Deliveries within Colombo and Gampaha arrive within 1-2 business days. Outstation deliveries to Kandy, Galle, Matara, Jaffna, and other districts take 2-4 business days via our tracked courier partners.",
    },
  ];

  return (
    <div className="py-16 bg-zinc-950 min-h-screen text-luxury-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-400 font-semibold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help Centre</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
        </div>

        {content?.content ? (
          <div className="prose prose-invert max-w-none text-sm text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: content.content }} />
        ) : (
          <div className="space-y-4">
            {defaultFaqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-850 space-y-2">
                <h3 className="text-base font-semibold text-gold-400">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">{faq.a}</p>
              </div>
            ))}
          </div>
        )}

        {/* Still have questions banner */}
        <div className="p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800 text-center space-y-4">
          <h3 className="text-lg font-serif font-bold text-white">Have a Specific Question?</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Our jewellery specialists in Kotte are always available on WhatsApp to answer questions regarding sizes, custom orders, or care.
          </p>
          <a
            href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp ({SITE_CONFIG.formattedWhatsApp})</span>
          </a>
        </div>
      </div>
    </div>
  );
}

