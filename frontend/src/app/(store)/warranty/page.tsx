import React from "react";
import { ShieldCheck, Sparkles, RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { api } from "@/services/api";

export const metadata = {
  title: "Warranty & Guarantee Policy | Colombo Gold Covering",
  description: "Official 6-month gold covering guarantee, re-polishing privileges, and care instructions.",
};

export default async function WarrantyPage() {
  let content = null;
  try {
    const res = await api.get("/content/warranty");
    content = res.data.data;
  } catch {}

  return (
    <div className="py-16 bg-zinc-950 min-h-screen text-luxury-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-400 font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Customer Protection</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Warranty &amp; Guarantee Policy
          </h1>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
        </div>

        {content?.content ? (
          <div className="prose prose-invert max-w-none text-sm text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: content.content }} />
        ) : (
          <div className="space-y-8">
            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-4">
              <h2 className="text-xl font-serif font-bold text-gold-400">Our 6-Month Gold-Covering Guarantee</h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                All Colombo Gold Covering jewellery comes with an official certificate of guarantee. We warrant that our micro-gold electroplating will retain its luster and adhere flawlessly without chipping or peeling under standard personal use for 6 months.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Covered by Warranty</span>
                </div>
                <ul className="text-xs text-zinc-400 space-y-2">
                  <li>&bull; Natural fading or dulling under normal personal use</li>
                  <li>&bull; Plating peeling or flaking from manufacturing issues</li>
                  <li>&bull; Clasp or link defects discovered on delivery</li>
                  <li>&bull; Free workshop re-polishing within warranty term</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-850 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Not Covered</span>
                </div>
                <ul className="text-xs text-zinc-400 space-y-2">
                  <li>&bull; Direct chemical damage from perfumes or alcohol</li>
                  <li>&bull; Physical breakage, severe impact, or forced bending</li>
                  <li>&bull; Scratches caused by improper abrasive storage</li>
                  <li>&bull; Alterations performed by third-party jewellers</li>
                </ul>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-gold-400" />
                <span>Re-Polishing Privileges in Kotte</span>
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Even after your warranty expires, Colombo Gold Covering provides subsidized lifetime re-polishing and re-plating services for all authentic pieces bearing our hallmark, ensuring your jewellery remains luminous across generations.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

