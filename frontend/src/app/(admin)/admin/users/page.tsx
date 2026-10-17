"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Plus,
  Shield,
  ShieldCheck,
  Mail,
  Calendar,
  X,
  Lock,
} from "lucide-react";
import { userService } from "@/services/userService";
import { IUser } from "@/types/user";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuthStore();
  const { showToast } = useUIStore();
  const [staffList, setStaffList] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "staff">("staff");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const data = await userService.listStaff();
      setStaffList(data || []);
    } catch (err) {
      console.error("Failed to load staff list:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      return showToast("Please fill all required credentials", "error");
    }

    try {
      setIsSubmitting(true);
      await userService.createStaff({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });
      showToast("Staff team member provisioned successfully", "success");
      setName("");
      setEmail("");
      setPassword("");
      setIsCreating(false);
      fetchStaff();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to create staff user", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentActive: boolean, sName: string) => {
    if (!confirm(`Are you sure you want to toggle status for "${sName}"?`)) return;
    try {
      const updated = await userService.toggleStatus(id);
      setStaffList((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isActive: updated.isActive } : s))
      );
      showToast(`Staff account status updated`, "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to toggle user status", "error");
    }
  };

  const isSuperAdmin = currentUser?.role === "superadmin";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Staff & Administrator Access</h2>
          <p className="text-xs text-zinc-400">
            Control employee access credentials and management permissions
          </p>
        </div>

        {isSuperAdmin && !isCreating && (
          <Button
            size="sm"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </Button>
        )}
      </div>

      {/* Creation Modal / Form */}
      {isCreating && (
        <div className="bg-zinc-900/60 border border-gold-500/40 rounded-2xl p-6 space-y-4 max-w-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-serif font-bold text-white text-base">
              Add New Staff / Admin Member
            </h3>
            <button onClick={() => setIsCreating(false)} className="text-zinc-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateStaff} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Full Name *
              </label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kasun Fernando"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Login Email *
              </label>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kasun@colombogoldcovering.lk"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Temporary Password *
              </label>
              <Input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Role & Permissions *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full h-11 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-gold-500"
              >
                <option value="staff">Staff (Orders & Stock Management)</option>
                <option value="admin">Admin (Catalogue, Orders, Settings)</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Provisioning..." : "Create Account"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Staff Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-zinc-500 text-xs">Loading staff team...</div>
        ) : staffList.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs">No staff accounts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px] bg-zinc-950/40">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Email Address</th>
                  <th className="py-3 px-3">Created</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {staffList.map((s) => (
                  <tr key={s._id} className="hover:bg-zinc-800/30">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-400 font-bold text-xs flex items-center justify-center uppercase">
                          {s.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-white">{s.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full capitalize text-[10px] font-semibold ${
                          s.role === "superadmin"
                            ? "bg-purple-950/60 text-purple-300 border border-purple-500/30"
                            : s.role === "admin"
                            ? "bg-gold-950/60 text-gold-300 border border-gold-500/30"
                            : "bg-blue-950/60 text-blue-300 border border-blue-500/30"
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>{s.role}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-zinc-300 font-mono text-[11px]">
                      {s.email}
                    </td>

                    <td className="py-3.5 px-3 text-zinc-400">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          s.isActive
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-950/60 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {s.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isSuperAdmin && s.role !== "superadmin" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(s._id, s.isActive, s.name)}
                          className="h-7 text-xs px-2"
                        >
                          {s.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

