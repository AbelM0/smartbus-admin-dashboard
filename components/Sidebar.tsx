"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const navItems = [
  { href: "/", labelKey: "dashboard", icon: "dashboard" },
  { href: "/users", labelKey: "users", icon: "group" },
  { href: "/routes", labelKey: "routes", icon: "directions_bus" },
  { href: "/analytics", labelKey: "analytics", icon: "analytics" },
  { href: "/permissions", labelKey: "permissions", icon: "lock_person" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("sidebar");

  return (
    <aside className="hidden md:flex flex-col h-screen w-60 bg-[#faf8ff] p-3 space-y-1.5 flex-shrink-0 border-r border-outline-variant/10">
      <div className="mb-6 px-2 flex items-center space-x-2.5">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            directions_bus
          </span>
        </div>
        <div>
          <h1 className="text-base font-black tracking-tight text-[#003d9b]">Smart Bus</h1>
          <p className="text-[9px] uppercase tracking-widest text-outline">Transit Authority</p>
        </div>
      </div>

      <nav className="space-y-1 flex-grow">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2.5 rounded-lg px-3 py-2 hover:translate-x-1 transition-transform duration-200 ${
                isActive
                  ? "bg-[#003d9b] text-white shadow-sm"
                  : "text-slate-600 hover:bg-[#e1e2ec]"
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-outline-variant/20 space-y-1">
        <Link
          href="#"
          className="flex items-center space-x-2.5 text-slate-600 hover:bg-[#e1e2ec] rounded-lg px-3 py-2 hover:translate-x-1 transition-transform duration-200"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
          <span className="text-xs font-medium">{t("settings")}</span>
        </Link>
        <div className="p-4 mt-auto">
          <div className="bg-red-50 rounded-xl p-3 border border-red-100">
            <div className="flex items-center space-x-2 text-red-600 mb-1">
              <span className="material-symbols-outlined text-sm">error</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">1 {t("issue")}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
