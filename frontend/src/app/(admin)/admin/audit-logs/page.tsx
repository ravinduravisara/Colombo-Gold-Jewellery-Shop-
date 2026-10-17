"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldAlert,
  Search,
  User,
  Clock,
  Layers,
  Activity,
} from "lucide-react";
import { adminService, IAuditLog } from "@/services/adminService";
import { Button } from "@/components/ui/button";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<IAuditLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const res = await adminService.getAuditLogs({ page, limit: 25 });
      setLogs(res.logs || []);
      setTotalPages(res.meta?.totalPages || res.meta?.pages || 1);
      setTotalCount(res.meta?.total || 0);
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-white">Security & Audit Activity Logs</h2>
          <p className="text-xs text-zinc-400">
            Immutable log of all administrator operations, status updates, pricing changes, and logins ({totalCount} entries)
          </p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center text-zinc-500 text-xs">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs">No audit logs recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px] bg-zinc-950/40">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-3">Administrator</th>
                  <th className="py-3 px-3">Action</th>
                  <th className="py-3 px-3">Resource Target</th>
                  <th className="py-3 px-3">Details / Change</th>
                  <th className="py-3 px-4 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-zinc-800/30">
                    <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-semibold text-white font-sans">
                        {log.user?.name || "System"}
                      </span>
                      <span className="text-[10px] text-zinc-500 block">
                        {log.user?.email}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20 text-[10px] uppercase font-bold">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-zinc-300 font-sans">
                      {log.resource}
                      {log.resourceId && (
                        <span className="text-[10px] text-zinc-500 block font-mono">
                          ID: {log.resourceId}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-zinc-400 max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : "—"}
                    </td>

                    <td className="py-3 px-4 text-right text-zinc-500">
                      {log.ipAddress || "127.0.0.1"}
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
