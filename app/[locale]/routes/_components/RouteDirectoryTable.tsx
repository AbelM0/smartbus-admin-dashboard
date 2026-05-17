"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { useSearchRoutes } from "@/hooks/routes";
import { Route } from "@/types/api/routes";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Navigation2,
  Eye,
  MoreVertical,
  MapPin,
  Clock,
  Ruler,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RouteDetailDialog } from "./RouteDetailDialog";


type SortOrder = "asc" | "desc";
type SortBy = "createdAt" | "name" | "routeNumber" | "distance" | "duration";

function SortIcon({ field, current, order }: { field: SortBy; current: SortBy; order: SortOrder }) {
  if (field !== current) return <ArrowUpDown className="w-3 h-3 text-slate-300 ml-1 inline" />;
  return order === "asc"
    ? <ArrowUp className="w-3 h-3 text-primary ml-1 inline" />
    : <ArrowDown className="w-3 h-3 text-primary ml-1 inline" />;
}

function formatDuration(mins: number) {
  if (!mins) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function formatDistance(meters: number) {
  if (!meters) return "—";
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
}

function formatPrice(price: number) {
  if (price == null) return "—";
  const val = price >= 100 ? price / 100 : price;
  return `ETB ${val.toFixed(2)}`;
}

function RouteInitialsAvatar({ routeNumber }: { routeNumber: string }) {
  return (
    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-[10px] ring-1 ring-primary/20 shrink-0">
      {routeNumber}
    </div>
  );
}

export function RouteDirectoryTable() {
  const t = useTranslations("routes");

  // ── Search & filter state ──────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");

  // Debounced committed values sent to the API
  const [committedQ, setCommittedQ] = useState("");
  const [committedDeparture, setCommittedDeparture] = useState("");
  const [committedDestination, setCommittedDestination] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [detailRouteId, setDetailRouteId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openDetail = (id: string) => {
    setDetailRouteId(id);
    setDetailOpen(true);
  };


  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleCommit = useCallback(
    (q: string, dep: string, dest: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setCommittedQ(q);
        setCommittedDeparture(dep);
        setCommittedDestination(dest);
        setPage(1);
      }, 400);
    },
    []
  );

  const handleSearchChange = (val: string) => {
    setSearch(val);
    scheduleCommit(val, departure, destination);
  };

  const handleDepartureChange = (val: string) => {
    setDeparture(val);
    scheduleCommit(search, val, destination);
  };

  const handleDestinationChange = (val: string) => {
    setDestination(val);
    scheduleCommit(search, departure, val);
  };

  const clearFilters = () => {
    setSearch("");
    setDeparture("");
    setDestination("");
    setCommittedQ("");
    setCommittedDeparture("");
    setCommittedDestination("");
    setPage(1);
  };

  const hasActiveFilters = committedQ || committedDeparture || committedDestination;

  const handleSort = (field: SortBy) => {
    if (field === sortBy) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  // ── Data fetching — always via search endpoint ─────────────────────────
  const { data, isLoading, isError } = useSearchRoutes({
    page,
    limit: 15,
    sortBy,
    sortOrder,
    q: committedQ || undefined,
    departure: committedDeparture || undefined,
    destination: committedDestination || undefined,
  });

  const routes = data?.data ?? [];
  const meta = data?.meta;

  // ── Sort header helper ─────────────────────────────────────────────────
  const SortHeader = ({ field, label }: { field: SortBy; label: string }) => (
    <th
      className="px-4 py-3 cursor-pointer select-none hover:text-slate-600 transition-colors"
      onClick={() => handleSort(field)}
    >
      {label}
      <SortIcon field={field} current={sortBy} order={sortOrder} />
    </th>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm">
      {/* ── Toolbar ────────────────────────────────────────────────────── */}
      <div className="px-4 py-3.5 border-b border-slate-100 space-y-3">
        {/* Row 1: title + controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">{t("corridor_table")}</h3>
            {meta && (
              <p className="text-[10px] text-slate-400 mt-0.5">
                {meta.total} {meta.total === 1 ? "route" : "routes"} total
                {hasActiveFilters && (
                  <span className="ml-1.5 text-primary font-semibold">· filtered</span>
                )}
              </p>
            )}
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {/* Keyword search */}
            <div className="relative flex items-center flex-1 sm:w-56">
              <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                id="route-search"
                type="text"
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder={t("search_placeholder")}
                className="pl-9 pr-3 h-9 w-full text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>

            {/* Filter toggle */}
            <button
              id="route-filter-toggle"
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-1.5 px-3 h-9 text-xs font-semibold rounded-lg border transition shrink-0 ${
                showFilters || hasActiveFilters
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {t("filter")}
              {hasActiveFilters && (
                <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center">
                  {[committedQ, committedDeparture, committedDestination].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: expanded departure / destination filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 items-end pt-1 pb-0.5">
            {/* Departure */}
            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t("filter_departure")}
              </label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                <input
                  id="route-filter-departure"
                  type="text"
                  value={departure}
                  onChange={e => handleDepartureChange(e.target.value)}
                  placeholder={t("filter_departure_placeholder")}
                  className="pl-8 pr-3 h-8 w-full text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            </div>

            {/* Arrow separator */}
            <div className="pb-1 text-slate-300 font-bold text-sm select-none">→</div>

            {/* Destination */}
            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t("filter_destination")}
              </label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                <input
                  id="route-filter-destination"
                  type="text"
                  value={destination}
                  onChange={e => handleDestinationChange(e.target.value)}
                  placeholder={t("filter_destination_placeholder")}
                  className="pl-8 pr-3 h-8 w-full text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            </div>

            {/* Clear */}
            {hasActiveFilters && (
              <button
                id="route-filter-clear"
                onClick={clearFilters}
                className="flex items-center gap-1 px-2.5 h-8 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-lg hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition self-end"
              >
                <X className="w-3 h-3" />
                {t("clear_filters")}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/80">
              <th className="px-4 py-3">{t("corridor_path")}</th>
              <SortHeader field="distance" label={t("distance")} />
              <SortHeader field="duration" label={t("duration")} />
              <th className="px-4 py-3">{t("stops")}</th>
              <th className="px-4 py-3">{t("price")}</th>
              <th className="px-4 py-3">{t("status")}</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary/60 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">{t("loading")}</p>
                </td>
              </tr>
            )}
            {isError && !isLoading && (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <Navigation2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">{t("error_loading")}</p>
                </td>
              </tr>
            )}
            {!isLoading && !isError && routes.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <Navigation2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">{t("no_routes")}</p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-2 text-xs text-primary hover:underline"
                    >
                      {t("clear_filters")}
                    </button>
                  )}
                </td>
              </tr>
            )}

            {!isLoading &&
              routes.map((route: Route) => (
                <tr key={route.id} className="hover:bg-slate-50/80 transition-colors group">
                  {/* Route info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <RouteInitialsAvatar routeNumber={route.routeNumber} />
                      <div>
                        <p className="font-semibold text-slate-800 text-xs leading-tight">{route.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-300" />
                          <p className="text-[10px] text-slate-400 leading-tight">
                            {route.startStopName} → {route.endStopName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Distance */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-slate-300" />
                      <span className="text-xs text-slate-600 font-medium">
                        {formatDistance(route.distance)}
                      </span>
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-300" />
                      <span className="text-xs text-slate-600 font-medium">
                        {formatDuration(route.duration)}
                      </span>
                    </div>
                  </td>

                  {/* Stops */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                      <MapPin className="w-2.5 h-2.5" />
                      {route.totalStops} {route.totalStops === 1 ? "stop" : "stops"}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-slate-700">
                      {formatPrice(route.price)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        route.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {route.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openDetail(route.id)}
                        className="text-slate-300 hover:text-primary transition-colors p-1 rounded cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ─────────────────────────────────────────────────── */}
      {meta && meta.totalPages > 1 && (
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs text-slate-400">
            Showing {(page - 1) * meta.limit + 1}–{Math.min(page * meta.limit, meta.total)} of{" "}
            {meta.total} routes
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

      {/* ── Dialogs ────────────────────────────────────────────────────── */}
      <RouteDetailDialog
        routeId={detailRouteId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}

