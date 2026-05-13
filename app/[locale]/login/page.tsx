"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSignIn } from "@/hooks/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bus, Loader2, Lock, Phone, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations("auth");
  const { mutate: signIn, isPending } = useSignIn();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) return;

    signIn({
      identifier,
      identifierType: "PHONE",
      password,
    });
  };

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Branding (Hidden on very small screens) */}
      <div className="hidden md:flex md:w-1/2 bg-slate-900 flex-col justify-between p-12 text-white relative">
        {/* Subtle background pattern/gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <Bus className="w-6 h-6 text-slate-900" />
          </div>
          <span className="text-xl font-bold tracking-tight">SmartBus Transit</span>
        </div>

        <div className="relative z-10 max-w-lg mt-auto">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Intelligent transit management for the modern city.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Monitor routes, track fleet performance, and manage commuter profiles from a centralized, secure dashboard.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative bg-white">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile logo header */}
          <div className="flex items-center space-x-3 md:hidden mb-8">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">SmartBus Transit</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {t("loginTitle") || "Welcome Back"}
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              {t("loginDescription") || "Enter your credentials to access the dashboard"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-sm font-semibold text-slate-700">
                {t("phoneLabel") || "Phone Number"}
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Phone className="w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <Input
                  id="identifier"
                  type="tel"
                  placeholder="e.g. +251..."
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-10 h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-600 rounded-xl transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  {t("passwordLabel") || "Password"}
                </Label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-600 rounded-xl transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium shadow-sm transition-all active:scale-[0.98] mt-4 flex items-center justify-center group"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin text-slate-400" />
                  {t("loggingIn") || "Signing in..."}
                </>
              ) : (
                <>
                  {t("loginButton") || "Sign in"}
                  <ArrowRight className="w-4 h-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
