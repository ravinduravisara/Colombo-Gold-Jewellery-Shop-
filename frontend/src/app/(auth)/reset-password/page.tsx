"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg("Missing or invalid password reset token.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg("");
      await authService.resetPassword({ token, newPassword: password });
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || "Password reset token is invalid or expired."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4 py-4">
        <p className="text-sm text-red-400">
          Invalid or expired password reset link. Please request a new link.
        </p>
        <Link href="/forgot-password">
          <Button className="w-full">Request Reset Link</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {isSuccess ? (
        <div className="text-center space-y-4 py-4">
          <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/40 flex items-center justify-center mx-auto text-gold-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-serif font-bold text-white">Password Updated</h2>
          <p className="text-sm text-zinc-300">
            Your password has been reset successfully. Redirecting you to sign in...
          </p>
          <div className="pt-4">
            <Link href="/login">
              <Button className="w-full">Sign In Now</Button>
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
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                type="password"
                required
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                type="password"
                required
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 group"
          >
            <span>{isLoading ? "Updating Password..." : "Reset Password"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs text-zinc-400 hover:text-gold-400 transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
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
            Create New Password
          </h1>
          <p className="text-xs text-zinc-400">
            Please choose a strong, secure password for your account.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-6 text-zinc-400">Loading form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}

