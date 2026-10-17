"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variants = {
      primary:
        "bg-gold-500 hover:bg-gold-600 text-luxury-black font-semibold shadow-gold hover:shadow-gold-lg",
      gold: "bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-luxury-black font-bold tracking-wide shadow-gold",
      secondary:
        "bg-luxury-charcoal hover:bg-zinc-800 text-luxury-ivory border border-zinc-700/60",
      outline:
        "border border-gold-500/60 text-gold-500 hover:bg-gold-500/10 hover:border-gold-500",
      ghost:
        "text-zinc-300 hover:text-gold-400 hover:bg-zinc-800/40",
      destructive:
        "bg-rose-600 hover:bg-rose-700 text-white font-medium",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs rounded-md",
      md: "h-10 px-4 text-sm rounded-md",
      lg: "h-12 px-6 text-base rounded-lg tracking-wider",
      icon: "h-10 w-10 p-0 rounded-full",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

