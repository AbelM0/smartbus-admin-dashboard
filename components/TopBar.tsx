"use client";

import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useUserStore } from "@/stores/user";
import { useSidebarStore } from "@/stores/sidebar";
import { LogOut, Menu } from "lucide-react";
import { useLogout } from "@/hooks/auth";

export default function TopBar() {
  const t = useTranslations("topbar");
  const { user } = useUserStore();
  const { isCollapsed, toggle } = useSidebarStore();
  const { mutate: handleLogout, isPending: isLoggingOut } = useLogout();

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const formatRole = (role: string) => {
    if (!role) return "";
    return role.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <header className="flex justify-between items-center w-full px-6 py-2.5 sticky top-0 bg-[#faf8ff] z-30 border-b border-outline-variant/10">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggle}
          className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center space-x-6">
        <LanguageSwitcher />
        <div className="flex items-center space-x-3 border-l border-outline-variant/30 pl-4">

          {user ? (
            <>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-primary leading-none">{user.fullName}</p>
                <p className="text-[9px] text-outline font-medium">{formatRole(user.role)}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] ring-2 ring-primary/20">
                {getInitials(user.fullName)}
              </div>
              <button 
                onClick={() => handleLogout()}
                disabled={isLoggingOut}
                className="text-outline hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors ml-2 disabled:opacity-50" 
                title="Logout"
              >
                <LogOut className={`w-4 h-4 ${isLoggingOut ? 'opacity-50' : ''}`} />
              </button>
            </>
          ) : (
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-outline leading-none">Not logged in</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
