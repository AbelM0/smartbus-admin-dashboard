"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useGetUsers } from "@/hooks/users";
import { User } from "@/types/api/auth";
import { Search, Filter, ChevronLeft, ChevronRight, Loader2, UserCircle2, Eye, MoreVertical, Ban, UserCheck } from "lucide-react";
import { UserDetailDialog } from "./UserDetailDialog";
import { useDisableUser, useEnableUser } from "@/hooks/users";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type RoleFilter = "PASSENGER" | "DRIVER" | "ADMIN" | "SUPER_ADMIN" | "";

const ROLE_TABS: { label: string; value: RoleFilter }[] = [
  { label: "All Accounts", value: "" },
  { label: "Passengers", value: "PASSENGER" },
  { label: "Drivers", value: "DRIVER" },
  { label: "Administrators", value: "ADMIN" },
];

export const ROLE_STYLES: Record<string, string> = {
  PASSENGER:   "bg-blue-50 text-blue-700",
  DRIVER:      "bg-amber-50 text-amber-700",
  ADMIN:       "bg-purple-50 text-purple-700",
  SUPER_ADMIN: "bg-rose-50 text-rose-700",
};

export const STATUS_STYLES: Record<string, string> = {
  ACTIVE:               "bg-emerald-50 text-emerald-700",
  DISABLED:             "bg-slate-100 text-slate-500",
  PENDING_VERIFICATION: "bg-orange-50 text-orange-600",
};

export function formatRole(role: string) {
  return role.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export function formatStatus(status: string) {
  return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function timeAgo(dateStr: string | null) {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function UserInitialsAvatar({ name }: { name: string }) {
  const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] ring-1 ring-primary/20 shrink-0">
      {initials}
    </div>
  );
}

export function UserDirectoryTable() {
  const t = useTranslations("users");

  const [roleFilter, setRoleFilter] = useState<RoleFilter>("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openDetail = (id: string) => {
    setSelectedUserId(id);
    setDetailOpen(true);
  };

  const { mutate: disable, isPending: isDisabling } = useDisableUser();
  const { mutate: enable, isPending: isEnabling } = useEnableUser();

  // Simple debounce
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    clearTimeout((handleSearch as any)._timer);
    (handleSearch as any)._timer = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
  }, []);

  const { data, isLoading, isError } = useGetUsers({
    page,
    limit: 10,
    role: roleFilter,
    q: debouncedSearch,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const users = data?.data?.items ?? [];
  const meta = data?.data?.meta;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border-b border-slate-100">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg flex-wrap">
          {ROLE_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => { setRoleFilter(tab.value); setPage(1); }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                roleFilter === tab.value
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex items-center flex-1 sm:w-64">
            <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder={t("search_placeholder") || "Search users by name or email..."}
              className="pl-9 pr-3 h-9 w-full text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 h-9 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
            <Filter className="w-3.5 h-3.5" />
            {t("filter") || "Filter"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/80">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Active</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary/60 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Loading users...</p>
                </td>
              </tr>
            )}
            {isError && !isLoading && (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <UserCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Failed to load users.</p>
                </td>
              </tr>
            )}
            {!isLoading && !isError && users.length === 0 && (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <UserCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No users found.</p>
                </td>
              </tr>
            )}
            {!isLoading && users.map((user: User) => (
              <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <UserInitialsAvatar name={user.fullName} />
                    <div>
                      <p className="font-semibold text-slate-800 text-xs leading-tight">{user.fullName}</p>
                      <p className="text-[10px] text-slate-400">{user.email ?? user.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${ROLE_STYLES[user.role] ?? "bg-slate-100 text-slate-600"}`}>
                    {formatRole(user.role)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLES[user.status] ?? "bg-slate-100 text-slate-500"}`}>
                    {formatStatus(user.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{timeAgo(user.lastLoginAt)}</td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button 
                      onClick={() => openDetail(user.id)}
                      className="text-slate-300 hover:text-primary transition-colors p-1 rounded cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-slate-300 hover:text-primary transition-colors p-1 rounded cursor-pointer">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {user.status === "DISABLED" ? (
                          <DropdownMenuItem 
                            className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50 gap-2 cursor-pointer"
                            disabled={isEnabling}
                            onClick={() => enable(user.id)}
                          >
                            {isEnabling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5 !text-emerald-600" />}
                            Enable Account
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 gap-2 cursor-pointer"
                            disabled={isDisabling}
                            onClick={() => disable(user.id)}
                          >
                            {isDisabling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5 !text-red-600" />}
                            Disable Account
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && (
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs text-slate-400">
            Showing {((page - 1) * (meta.limit)) + 1}–{Math.min(page * meta.limit, meta.total)} of {meta.total} users
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="flex items-center gap-1 px-3 h-7 text-xs font-semibold rounded border border-slate-200 text-slate-500 hover:bg-white hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages}
              className="flex items-center gap-1 px-3 h-7 text-xs font-semibold rounded border border-slate-200 text-slate-500 hover:bg-white hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <UserDetailDialog 
        userId={selectedUserId} 
        open={detailOpen} 
        onOpenChange={setDetailOpen} 
      />
    </div>
  );
}
