"use client";

import React from "react";
import { useUIStore } from "@/store/uiStore";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toastMessage, showToast } = useUIStore();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-gold-400 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-500/30 bg-zinc-950/95",
    error: "border-rose-500/30 bg-zinc-950/95",
    info: "border-gold-500/30 bg-zinc-950/95",
    warning: "border-amber-500/30 bg-zinc-950/95",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-5 duration-200">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md text-white ${borders[toastMessage.type]}`}
      >
        {icons[toastMessage.type]}
        <div className="flex-1 text-sm">{toastMessage.text}</div>
        <button
          onClick={() => (useUIStore.getState() as any).toastMessage = null}
          className="text-zinc-500 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
