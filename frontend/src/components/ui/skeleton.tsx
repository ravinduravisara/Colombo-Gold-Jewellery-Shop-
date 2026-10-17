"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-800/60", className)}
      {...props}
    />
  );
}

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gold" | "success" | "warning" | "danger" | "outline";
}) {
  const variants = {
    default: "bg-zinc-800 text-zinc-300 border-zinc-700",
    gold: "bg-gold-500/10 text-gold-400 border-gold-500/30",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    outline: "bg-transparent text-zinc-300 border-zinc-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wider",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

