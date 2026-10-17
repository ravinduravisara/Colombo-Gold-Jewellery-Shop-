"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Mail, ArrowRight, Shield } from "lucide-react";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const { showToast } = useUIStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setErrorMsg("");
      const result = await authService.login({ email: email.trim(), password });
      setUser(result.user);
      showToast(`Welcome back, ${result.user.name}!`, "success");

      // Check for redirect query param
      const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const redirectTarget = searchParams?.get("redirect");

      if (result.user.role === "admin" || result.user.role === "superadmin" || result.user.role === "staff") {
        if (redirectTarget && redirectTarget.startsWith("/admin")) {
          router.push(redirectTarget);
        } else {
          router.push("/admin");
        }
      } else {
        if (redirectTarget && !redirectTarget.startsWith("/admin")) {
          router.push(redirectTarget);
        } else {
          router.push("/account");
        }
      }
    } catch (err: any) {
      console.error("Login failure:", err);
      const serverMessage = err?.response?.data?.message;
      if (serverMessage) {
        setErrorMsg(serverMessage);
      } else if (err?.message === "Network Error" || !err?.response) {
        setErrorMsg("Unable to connect to the backend server (http://localhost:5001). Please ensure it is running.");
      } else {
        setErrorMsg("Invalid email or password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-20 bg-zinc-950 min-h-screen text-luxury-ivory flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl bg-zinc-900/40 border border-gold-500/30 p-8 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        {/* Glow halo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,166,103,0.08)_0,transparent_70%)] pointer-events-none" />

        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-serif font-bold text-gold-400 tracking-wider uppercase">
              Colombo Gold
            </span>
          </Link>
          <h1 className="text-xl font-serif font-bold text-white tracking-tight">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-zinc-400">
            Access your saved addresses, track order histories, and manage your wishlist.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-zinc-300 tracking-wide uppercase">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-gold-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full font-bold shadow-gold mt-2"
            isLoading={isLoading}
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="text-center text-xs text-zinc-400 pt-2 border-t border-zinc-850">
          <span>Don&apos;t have an account yet? </span>
          <Link href="/register" className="text-gold-400 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

