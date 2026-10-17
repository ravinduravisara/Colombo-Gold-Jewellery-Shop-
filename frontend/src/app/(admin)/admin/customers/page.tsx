"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { userService } from "@/services/userService";
import { IUser } from "@/types/user";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminCustomersPage() {
  const { showToast } = useUIStore();
  const [customers, setCustomers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await userService.listCustomers({
        page,
        limit: 15,
        search: search.trim() || undefined,
      });
      setCustomers(res.data || []);
      setTotalPages(res.meta?.totalPages || res.meta?.pages || 1);
      setTotalCount(res.meta?.total || 0);
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean, name: string) => {
    const action = currentStatus ? "deactivate" : "activate";
    if (!confirm(`Are you sure you want to ${action} customer "${name}"?`)) return;

    try {
      const updated = await userService.toggleStatus(id);
      setCustomers((prev) =>
        prev.map((c) => (c._id === id ? { ...c, isActive: updated.isActive } : c))
      );
      showToast(`Customer account ${updated.isActive ? "activated" : "deactivated"}`, "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to toggle status", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Registered Customer Accounts</h2>
          <p className="text-xs text-zinc-400">
            View customer directories, purchase activity, and account status ({totalCount} customers)
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, email address, or phone..."
              className="pl-10 h-10 text-xs"
            />
          </div>
          <Button type="submit" size="sm" variant="outline" className="h-10 text-xs px-4">
            Search
          </Button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-zinc-500 text-xs">Loading customer directory...</div>
        ) : customers.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs">No customer accounts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px] bg-zinc-950/40">
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-3">Contact Email</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Joined Date</th>
                  <th className="py-3 px-3">Account Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {customers.map((c) => (
                  <tr key={c._id} className="hover:bg-zinc-800/30">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-400 font-bold text-xs flex items-center justify-center">
                          {c.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-white">{c.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{c.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-zinc-300">
                      {c.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{c.phone}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-600 italic">Not provided</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-zinc-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          c.isActive
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-950/60 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {c.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(c._id, c.isActive, c.name)}
                        className={`text-xs h-7 px-2.5 ${
                          c.isActive
                            ? "border-red-500/40 text-red-400 hover:bg-red-950/30"
                            : "border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/30"
                        }`}
                      >
                        {c.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
