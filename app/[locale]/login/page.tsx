"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSignIn } from "@/hooks/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Bus, Loader2, Lock, Phone, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations("auth");
  const { mutate: signIn, isPending } = useSignIn();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      {/* Left side - Background Image with overlay */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Background image */}
        <img
          src="/login-bg.png"
          alt={t("brand_name")}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight drop-shadow">{t("brand_dashboard")}</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg mt-auto">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6 drop-shadow-lg">
            {t("brandTagline")}
          </h1>
          <p className="text-white/75 text-lg leading-relaxed">
            {t("brandSubtitle")}
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative bg-white">
        {/* Language switcher - top right */}
        <div className="absolute top-5 right-6">
          <LanguageSwitcher />
        </div>

        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo header */}
          <div className="flex items-center justify-between md:hidden mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">{t("brand_name")}</span>
            </div>
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-600 rounded-xl transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 cursor-pointer right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
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
