import React from "react";
import { ShieldCheck } from "lucide-react";
import { api } from "@/services/api";

export const metadata = {
  title: "Privacy Policy | Colombo Gold Covering",
  description: "Customer privacy policy and data security practices for Colombo Gold Covering.",
};

export default async function PrivacyPolicyPage() {
  let content = null;
  try {
    const res = await api.get("/content/privacy-policy");
    content = res.data.data;
  } catch {}

  return (
    <div className="py-16 bg-zinc-950 min-h-screen text-luxury-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-400 font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Privacy Policy
          </h1>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
        </div>

        {content?.content ? (
          <div className="prose prose-invert max-w-none text-sm text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: content.content }} />
        ) : (
          <div className="space-y-6 text-sm text-zinc-300 leading-relaxed rounded-3xl bg-zinc-900/30 border border-zinc-850 p-8 sm:p-12">
            <h2 className="text-lg font-serif font-bold text-white">1. Information We Collect</h2>
            <p>
              When you place an order, create an account, or contact us through WhatsApp, we collect personal information such as your name, delivery address, contact phone number, and email. This data is strictly used to fulfill your orders and communicate delivery status updates.
            </p>

            <h2 className="text-lg font-serif font-bold text-white pt-4">2. Bank Transfer Receipts</h2>
            <p>
              Any payment slips or bank transfer receipts uploaded during checkout are securely stored and encrypted. They are accessible only to authorized finance administrators for transaction verification and are never shared publicly.
            </p>

            <h2 className="text-lg font-serif font-bold text-white pt-4">3. No Third-Party Sales</h2>
            <p>
              Colombo Gold Covering values your trust. We do not sell, rent, or lease your personal information to third-party marketing companies.
            </p>

            <h2 className="text-lg font-serif font-bold text-white pt-4">4. Cookies &amp; Session</h2>
            <p>
              We use secure, HTTP-only authentication cookies to maintain your login session and shopping cart items without storing credentials in insecure browser storage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

