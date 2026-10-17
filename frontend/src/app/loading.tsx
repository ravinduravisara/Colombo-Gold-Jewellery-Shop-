import React from "react";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-gold-400">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-widest font-serif text-zinc-400">
          Colombo Gold Covering
        </p>
      </div>
    </div>
  );
}

