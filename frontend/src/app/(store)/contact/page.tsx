"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  Send,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";
import { useUIStore } from "@/store/uiStore";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { showToast } = useUIStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post("/enquiries", {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject: subject.trim(),
        message: message.trim(),
      });
      setIsSuccess(true);
      showToast("Thank you! Your enquiry has been received.", "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to submit enquiry. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    "Hello Colombo Gold Covering! I am inquiring through your website contact page."
  )}`;

  return (
    <div className="py-16 bg-zinc-950 min-h-screen text-luxury-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-400 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Service & Showroom</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Contact Colombo Gold Covering
          </h1>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
          <p className="mt-3 text-xs sm:text-sm text-zinc-400">
            Have a question about bridal sets, sizes, custom orders, or re-polishing? Reach out to our dedicated team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left 5 Cols: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/50 border border-zinc-850 space-y-6 shadow-xl">
              <h2 className="text-xl font-serif font-bold text-white">Showroom & Workshop</h2>

              <div className="space-y-4 text-xs text-zinc-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm font-semibold mb-0.5">Physical Address</strong>
                    <span>{SITE_CONFIG.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm font-semibold mb-0.5">Telephone Hotline</strong>
                    <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-gold-400 transition-colors">
                      {SITE_CONFIG.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm font-semibold mb-0.5">Email Inquiries</strong>
                    <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-gold-400 transition-colors">
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white text-sm font-semibold mb-0.5">Business Hours</strong>
                    <span>Monday &ndash; Saturday: 9:00 AM &ndash; 7:00 PM</span>
                    <span className="block text-zinc-500">Sunday: Closed for workshop maintenance</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Box */}
              <div className="pt-4 border-t border-zinc-800">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-emerald-950/40"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Instant WhatsApp Chat ({SITE_CONFIG.formattedWhatsApp})</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Working Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-3xl bg-zinc-900/40 border border-zinc-850 shadow-2xl">
              <h2 className="text-xl font-serif font-bold text-white mb-2">Send an Online Enquiry</h2>
              <p className="text-xs text-zinc-400 mb-6">
                Fill in your details below and an authorized representative will respond within 24 hours.
              </p>

              {isSuccess ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h3 className="text-lg font-serif font-bold text-white">Message Dispatched!</h3>
                  <p className="text-xs text-zinc-300 max-w-sm mx-auto">
                    Thank you, {name}! Your message has been received by our Kotte showroom team. We will get in touch shortly.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setIsSuccess(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name *"
                      required
                      placeholder="e.g. Ruwanthi Fernando"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      label="Email Address *"
                      type="email"
                      required
                      placeholder="ruwanthi@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number (Optional)"
                      type="tel"
                      placeholder="+94 77 ..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <Input
                      label="Subject *"
                      required
                      placeholder="e.g. Bridal Choker Inquiry"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 tracking-wide uppercase mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="How can we assist you with our jewellery collections or order policies?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3.5 rounded-md border border-zinc-800 bg-zinc-950 text-sm text-white placeholder-zinc-500 focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <Button type="submit" variant="gold" size="lg" className="w-full font-bold" isLoading={isSubmitting}>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Enquiry
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

