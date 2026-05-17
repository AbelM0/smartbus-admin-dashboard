"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { 
  Loader2, 
  Search, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Ban
} from "lucide-react";
import { useGetTrips, useCancelTrip } from "@/hooks/trips";
import { TripStatus } from "@/types/api/trips";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortBy = "createdAt" | "scheduledFor" | "status";
type SortOrder = "asc" | "desc";

const STATUS_CONFIG: Record<TripStatus, { bg: string, text: string, label: string }> = {
  SCHEDULED: { bg: "bg-slate-100", text: "text-slate-600", label: "Scheduled" },
  IN_PROGRESS: { bg: "bg-blue-100", text: "text-blue-700", label: "In Progress" },
  COMPLETED: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Completed" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
};

export function TripsTable() {
  const t = useTranslations("trips");

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [status, setStatus] = useState<TripStatus | "">("");

  const { data, isLoading, isError } = useGetTrips({
    page,
    limit: 15,
    sortBy,
    sortOrder,
    status: status || undefined,
  });

  const { mutate: cancel, isPending: isCancelling } = useCancelTrip();

  const handleCancel = (id: string) => {
    if (window.confirm("Are you sure you want to cancel this trip? This action cannot be undone.")) {
      cancel(id);
    }
  };

  const trips = data?.data?.items ?? [];
  const meta = data?.data?.meta;

  const handleSort = (field: SortBy) => {
    if (field === sortBy) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: SortBy }) => {
    if (sortBy !== field) return <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-40" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3 h-3 inline-block ml-1 text-primary" />
    ) : (
      <ArrowDown className="w-3 h-3 inline-block ml-1 text-primary" />
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm">
      <div className="px-4 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">{t("trips_table")}</h3>
          {meta && (
            <p className="text-[10px] text-slate-400 mt-0.5">
              {meta.total} trips total
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as TripStatus | "");
                setPage(1);
              }}
              className="appearance-none pl-3 pr-8 h-9 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition font-medium text-slate-600"
            >
              <option value="">{t("status_all")}</option>
              <option value="SCHEDULED">{t("status_scheduled")}</option>
              <option value="IN_PROGRESS">{t("status_in_progress")}</option>
              <option value="COMPLETED">{t("status_completed")}</option>
              <option value="CANCELLED">{t("status_cancelled")}</option>
            </select>
            <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-3">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <p className="text-xs text-slate-400">Loading trips...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-500">
            <p className="text-sm font-medium">Failed to load trips.</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 space-y-2">
            <Calendar className="w-8 h-8 text-slate-300" />
            <p className="text-sm font-medium">No trips found</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] uppercase bg-slate-50/50 text-slate-500 border-b border-slate-100 tracking-wider">
              <tr>
                <th className="px-4 py-3 font-semibold rounded-tl-xl cursor-pointer" onClick={() => handleSort("scheduledFor")}>
                  Schedule <SortIcon field="scheduledFor" />
                </th>
                <th className="px-4 py-3 font-semibold">Route</th>
                <th className="px-4 py-3 font-semibold">Driver & Bus</th>
                <th className="px-4 py-3 font-semibold cursor-pointer" onClick={() => handleSort("status")}>
                  Status <SortIcon field="status" />
                </th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-900 font-medium text-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(trip.scheduledFor))}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <Clock className="w-3 h-3" />
                        {new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric", hour12: true }).format(new Date(trip.scheduledFor))}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-black">
                        {trip.route.routeNumber}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-xs">{trip.route.name}</span>
                        <span className="text-[10px] text-slate-500 font-medium">ID: {trip.route.id.split('-')[0]}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-slate-900 font-medium text-xs">
                        <User className="w-3 h-3 text-slate-400" />
                        {trip.driver.fullName}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-mono">
                        {trip.busIdentifier}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${STATUS_CONFIG[trip.status].bg} ${STATUS_CONFIG[trip.status].text}`}>
                      {t(`status_${trip.status.toLowerCase()}` as any) || STATUS_CONFIG[trip.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {trip.status === "SCHEDULED" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-slate-400 hover:text-primary transition-colors p-1 rounded cursor-pointer opacity-0 group-hover:opacity-100">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer text-xs text-red-600 focus:text-red-700 focus:bg-red-50"
                            onClick={() => handleCancel(trip.id)}
                            disabled={isCancelling}
                          >
                            <Ban className="w-3.5 h-3.5" />
                            Cancel Trip
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-700">{(meta.page - 1) * meta.limit + 1}</span> to <span className="font-bold text-slate-700">{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="font-bold text-slate-700">{meta.total}</span>
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center px-3 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg">
              {page} / {meta.totalPages}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
