"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Star,
  CheckCircle,
  XCircle,
  MessageSquare,
  Clock,
  ExternalLink,
} from "lucide-react";
import { adminService, IReview } from "@/services/adminService";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";

export default function AdminReviewsPage() {
  const { showToast } = useUIStore();
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getReviews({
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
      setReviews(res.reviews || []);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    try {
      await adminService.updateReviewStatus(id, status);
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
      showToast(`Review marked as ${status}`, "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to update review status", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Customer Reviews Moderation</h2>
          <p className="text-xs text-zinc-400">
            Verify verified customer testimonials and star ratings before public storefront publication
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Reviews</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved & Live</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-12 text-center text-zinc-500 text-xs">Loading customer reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-12 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 text-xs">No customer reviews found matching filter.</p>
          </div>
        ) : (
          reviews.map((r) => (
            <div
              key={r._id}
              className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-3 hover:border-gold-500/30 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-gold-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= r.rating ? "fill-gold-400 text-gold-400" : "text-zinc-700"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-white">
                    {(typeof r.user === "object" ? r.user?.name : null) || "Customer"}
                  </span>
                  <span className="text-xs text-zinc-500">•</span>
                  <span className="text-xs text-zinc-400">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recent"}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full w-fit ${
                    r.status === "approved"
                      ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                      : r.status === "rejected"
                      ? "bg-red-950/60 text-red-400 border border-red-500/30"
                      : "bg-amber-950/60 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              {/* Product link */}
              {r.product && typeof r.product === "object" && r.product.slug && (
                <div className="text-xs text-zinc-400 flex items-center gap-1">
                  <span>Reviewed piece:</span>
                  <Link
                    href={`/product/${r.product.slug}`}
                    target="_blank"
                    className="text-gold-400 hover:underline font-medium inline-flex items-center gap-1"
                  >
                    <span>{r.product.name}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {/* Comment */}
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
                &ldquo;{r.comment}&rdquo;
              </p>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-1">
                {r.status !== "approved" && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(r._id, "approved")}
                    className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Approve & Publish
                  </Button>
                )}
                {r.status !== "rejected" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(r._id, "rejected")}
                    className="h-7 text-xs border-red-500/40 text-red-400 hover:bg-red-950/20"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    Reject
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

