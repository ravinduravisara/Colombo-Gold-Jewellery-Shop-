"use client";

import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  Send,
  X,
} from "lucide-react";
import { adminService, IEnquiry } from "@/services/adminService";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminEnquiriesPage() {
  const { showToast } = useUIStore();
  const [enquiries, setEnquiries] = useState<IEnquiry[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Response Modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<IEnquiry | null>(null);
  const [responseNotes, setResponseNotes] = useState("");
  const [targetStatus, setTargetStatus] = useState("resolved");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEnquiries = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getEnquiries({
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setEnquiries(res.enquiries || []);
    } catch (err) {
      console.error("Failed to load enquiries:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleRespond = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    try {
      setIsSubmitting(true);
      const updated = await adminService.respondEnquiry(
        selectedEnquiry._id,
        responseNotes.trim(),
        targetStatus
      );
      setEnquiries((prev) =>
        prev.map((item) => (item._id === updated._id ? updated : item))
      );
      setSelectedEnquiry(null);
      setResponseNotes("");
      showToast("Enquiry notes and status updated", "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to respond", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Customer Enquiries & Custom Inquiries</h2>
          <p className="text-xs text-zinc-400">
            Messages received from the contact page and bespoke bridal jewellery inquiries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Inquiries</option>
            <option value="new">New Inquiries</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Enquiries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-2 py-12 text-center text-zinc-500 text-xs">
            Loading enquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-12 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 text-xs">No customer enquiries found.</p>
          </div>
        ) : (
          enquiries.map((enq) => (
            <div
              key={enq._id}
              className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-gold-500/30 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-sm">{enq.name}</span>
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      enq.status === "new"
                        ? "bg-amber-950/60 text-amber-400 border border-amber-500/30"
                        : enq.status === "resolved"
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                        : "bg-blue-950/60 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {enq.status?.replace("_", " ") || "new"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{enq.email}</span>
                  </span>
                  {enq.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{enq.phone}</span>
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-gold-400/90">{enq.subject}</h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
                    {enq.message}
                  </p>
                </div>

                {enq.responseNotes && (
                  <div className="text-[11px] bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-300">
                    <span className="font-semibold block text-[10px] uppercase text-emerald-400">
                      Staff Resolution Notes:
                    </span>
                    <span>{enq.responseNotes}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-500 text-[11px]">
                  {new Date(enq.createdAt).toLocaleDateString()}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedEnquiry(enq);
                    setResponseNotes(enq.responseNotes || "");
                    setTargetStatus(enq.status === "new" ? "resolved" : enq.status);
                  }}
                  className="h-7 text-xs text-gold-400 border-zinc-700"
                >
                  Manage / Respond
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Response Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-gold-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif font-bold text-white text-base">
                Respond to Enquiry: {selectedEnquiry.name}
              </h3>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRespond} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Update Status
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="in_progress">In Progress (Staff following up)</option>
                  <option value="resolved">Resolved (Customer contacted)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Resolution Notes / Actions Taken
                </label>
                <textarea
                  rows={4}
                  required
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  placeholder="e.g. Called customer on WhatsApp 077... confirmed custom 24K gold necklace design and quoted Rs. 35,000."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white leading-relaxed focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Commit Update"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedEnquiry(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

