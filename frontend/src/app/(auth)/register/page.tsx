"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const { showToast } = useUIStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg("");
      const result = await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });
      setUser(result.user);
      showToast(`Welcome to Colombo Gold Covering, ${result.user.name}!`, "success");
      router.push("/account");
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-20 bg-zinc-950 min-h-screen text-luxury-ivory flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl bg-zinc-900/40 border border-gold-500/30 p-8 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-serif font-bold text-gold-400 tracking-wider uppercase">
              Colombo Gold
            </span>
          </Link>
          <h1 className="text-xl font-serif font-bold text-white tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs text-zinc-400">
            Sign up to track purchases, save favourite jewellery, and receive member privileges.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name *"
            required
            placeholder="e.g. Ruwanthi Silva"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Email Address *"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Phone Number (Optional)"
            type="tel"
            placeholder="+94 77 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            label="Password *"
            type="password"
            required
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            label="Confirm Password *"
            type="password"
            required
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full font-bold shadow-gold mt-2"
            isLoading={isLoading}
          >
            <span>Register Account</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="text-center text-xs text-zinc-400 pt-2 border-t border-zinc-850">
          <span>Already have an account? </span>
          <Link href="/login" className="text-gold-400 font-semibold hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}

