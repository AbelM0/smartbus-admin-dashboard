"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSidebarStore } from "@/stores/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", labelKey: "dashboard", icon: "dashboard" },
  { href: "/trips", labelKey: "trips", icon: "departure_board" },
  { href: "/users", labelKey: "users", icon: "group" },
  { href: "/routes", labelKey: "routes", icon: "directions_bus" },
  { href: "/analytics", labelKey: "analytics", icon: "analytics" },
  { href: "/audit-logs", labelKey: "audit_logs", icon: "history" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const { isCollapsed } = useSidebarStore();

  return (
    <aside className={cn(
      "hidden md:flex flex-col h-screen bg-[#faf8ff] p-3 space-y-1.5 flex-shrink-0 border-r border-outline-variant/10 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-20" : "w-60"
    )}>
      <div className={cn(
        "mb-6 px-2 flex items-center gap-2.5 transition-all duration-300",
        isCollapsed ? "justify-center" : ""
      )}>
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            directions_bus
          </span>
        </div>
        {!isCollapsed && (
          <div className="animate-in fade-in duration-300 truncate">
            <h1 className="text-base font-black tracking-tight text-[#003d9b]">Smart Bus</h1>
            <p className="text-[9px] uppercase tracking-widest text-outline">Transit Authority</p>
          </div>
        )}
      </div>

      <nav className="space-y-1 flex-grow">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 transition-all duration-200 group",
                isActive
                  ? "bg-[#003d9b] text-white shadow-sm"
                  : "text-slate-600 hover:bg-[#e1e2ec] hover:translate-x-1",
                isCollapsed ? "justify-center px-0" : ""
              )}
              title={isCollapsed ? t(item.labelKey) : ""}
            >
              <span className="material-symbols-outlined text-xl shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <span className="text-sm font-medium animate-in fade-in slide-in-from-left-2 duration-300 truncate">
                  {t(item.labelKey)}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}

