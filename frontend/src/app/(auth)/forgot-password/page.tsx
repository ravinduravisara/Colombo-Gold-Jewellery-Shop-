"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsLoading(true);
      setErrorMsg("");
      await authService.forgotPassword(email.trim());
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || "Failed to process request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-20 bg-zinc-950 min-h-screen text-luxury-ivory flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl bg-zinc-900/40 border border-gold-500/30 p-8 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,166,103,0.08)_0,transparent_70%)] pointer-events-none" />

        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-serif font-bold text-gold-400 tracking-wider uppercase">
              Colombo Gold
            </span>
          </Link>
          <h1 className="text-xl font-serif font-bold text-white tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-zinc-400">
            Enter your account email to receive secure password recovery instructions.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/40 flex items-center justify-center mx-auto text-gold-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-serif font-bold text-white">Instructions Sent</h2>
            <p className="text-sm text-zinc-300">
              If an account matches <span className="text-gold-400 font-semibold">{email}</span>, we have dispatched a password reset link to your inbox.
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs text-center">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 group"
            >
              <span>{isLoading ? "Sending Link..." : "Send Reset Link"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="text-xs text-zinc-400 hover:text-gold-400 transition-colors inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

