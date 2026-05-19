"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useGetRoute, useGetRouteFare, useUpdateRoute, useDeleteRoute, useUpdateRouteStops, useUpdateRouteFares } from "@/hooks/routes";
import { RouteStop, RouteFare } from "@/types/api/routes";
import {
  Loader2,
  Navigation2,
  MapPin,
  Clock,
  Ruler,
  Banknote,
  Coins,
  Hash,
  Calendar,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Edit2,
  Plus,
  Trash2,
} from "lucide-react";

interface RouteDetailDialogProps {
  routeId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDistance(meters: number | null | undefined) {
  if (meters == null) return "—";
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
}

function formatDuration(mins: number | null | undefined) {
  if (!mins) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}

function formatPrice(price: number | string | null | undefined) {
  if (price == null) return "—";
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return "—";
  const val = num >= 100 ? num / 100 : num;
  return `ETB ${val.toFixed(2)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ── Metric card ───────────────────────────────────────────────────────────────

function MetricCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 flex items-center gap-3">
      <div className={`p-2 rounded-lg ${accent ?? "bg-primary/10"}`}>
        <Icon className={`w-4 h-4 ${accent ? "text-current" : "text-primary"}`} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-800 leading-tight">{value}</p>
      </div>
    </div>
  );
}

// ── Stop timeline item ─────────────────────────────────────────────────────────

function StopItem({ stop, isLast, fares }: { stop: RouteStop; isLast: boolean; fares?: RouteFare[] }) {
  const t = useTranslations("routes");
  const locale = useLocale();
  const isFirst = stop.sequence === 1;
  const dotColor = isFirst
    ? "bg-primary ring-primary/30"
    : isLast
    ? "bg-emerald-500 ring-emerald-200"
    : "bg-slate-300 ring-slate-200";

  // Cumulative fare from start (sequence 1) to current stop
  const stopFare = !isFirst && fares
    ? fares.find(f => f.fromStopSequence === 1 && f.toStopSequence === stop.sequence)
    : null;

  // Leg fare to next stop (sequence S to S+1)
  const legFare = !isLast && fares
    ? fares.find(f => f.fromStopSequence === stop.sequence && f.toStopSequence === stop.sequence + 1)
    : null;

  return (
    <div className="flex gap-3">
      {/* Timeline spine */}
      <div className="flex flex-col items-center shrink-0 w-5">
        <div className={`w-3 h-3 rounded-full ring-2 mt-0.5 shrink-0 ${dotColor}`} />
        {!isLast && <div className="w-px flex-1 bg-slate-200 mt-1" />}
      </div>

      {/* Stop content */}
      <div className={`pb-4 flex-1 min-w-0 ${isLast ? "pb-0" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {typeof stop.name === "object" ? (stop.name[locale] || stop.name["en"]) : stop.name}
              </p>
              {stopFare && (
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-1.5 py-0.5 rounded-full shrink-0">
                  {formatPrice(stopFare.amount)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {t("stop_index", { index: stop.sequence })} · {stop.latitude.toFixed(4)}°N, {stop.longitude.toFixed(4)}°E
            </p>
          </div>
          <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
            #{stop.sequence}
          </span>
        </div>

        {/* Leg metrics (distance + time to next) */}
        {!isLast && (stop.distanceToNext != null || stop.durationToNext != null || legFare != null) && (
          <div className="flex items-center gap-3 mt-2">
            {stop.distanceToNext != null && (
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <Ruler className="w-3 h-3" />
                {formatDistance(stop.distanceToNext)}
              </span>
            )}
            {stop.durationToNext != null && (
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <Clock className="w-3 h-3" />
                {formatDuration(stop.durationToNext)}
              </span>
            )}
            <ArrowRight className="w-3 h-3 text-slate-300 ml-auto" />
          </div>
        )}
      </div>
    </div>
  );
}



// ── Main dialog ───────────────────────────────────────────────────────────────

export function RouteDetailDialog({ routeId, open, onOpenChange }: RouteDetailDialogProps) {
  const t = useTranslations("routes");
  const locale = useLocale();
  const { data: response, isLoading, isError } = useGetRoute(routeId);
  const route = response?.data;

  // --- General Edit State ---
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    isActive: true,
    estimatedDuration: "",
    estimatedDistance: "",
  });

  // --- Stops Edit State ---
  const [isEditingStops, setIsEditingStops] = useState(false);
  const [editStops, setEditStops] = useState<{ name: string; sequence: number; latitude: string | number; longitude: string | number }[]>([]);

  // --- Fares Edit State ---
  const [isEditingFares, setIsEditingFares] = useState(false);
  const [editFares, setEditFares] = useState<{ fromStopSequence: number; toStopSequence: number; amount: string | number }[]>([]);

  useEffect(() => {
    if (route && !isEditing) {
      const nameStr = typeof route.name === "object"
        ? (route.name[locale] || route.name["en"] || "")
        : (route.name || "");
      const descStr = typeof route.description === "object"
        ? (route.description[locale] || route.description["en"] || "")
        : (route.description || "");

      setEditForm({
        name: nameStr,
        description: descStr,
        isActive: route.isActive ?? true,
        estimatedDuration: route.duration ? String(route.duration) : "",
        estimatedDistance: route.distance 
          ? String(route.distance >= 500 ? route.distance / 1000 : route.distance) 
          : "",
      });
    }
    if (route && !isEditingStops) {
      if (route.stops && route.stops.length > 0) {
        setEditStops(route.stops.map(s => ({
          name: typeof s.name === "object" ? (s.name[locale] || s.name["en"] || "") : (s.name || ""),
          sequence: s.sequence,
          latitude: s.latitude,
          longitude: s.longitude
        })));
      } else {
        setEditStops([{ name: "", sequence: 1, latitude: "", longitude: "" }]);
      }
    }
    if (route && !isEditingFares) {
      if (route.fares && route.fares.length > 0) {
        setEditFares(route.fares.map(f => ({
          fromStopSequence: f.fromStopSequence,
          toStopSequence: f.toStopSequence,
          amount: f.amount
        })));
      } else {
        setEditFares([]);
      }
    }
  }, [route, isEditing, isEditingStops, isEditingFares]);

  const { mutate: update, isPending: isUpdating } = useUpdateRoute(routeId || "", () => {
    setIsEditing(false);
  });

  const { mutate: remove, isPending: isDeleting } = useDeleteRoute(() => {
    onOpenChange(false);
  });

  const { mutate: updateStops, isPending: isUpdatingStops } = useUpdateRouteStops(routeId || "", () => {
    setIsEditingStops(false);
  });

  const { mutate: updateFaresMutation, isPending: isUpdatingFares } = useUpdateRouteFares(routeId || "", () => {
    setIsEditingFares(false);
  });

  const handleUpdate = () => {
    update({
      name: editForm.name,
      description: editForm.description,
      isActive: editForm.isActive,
      estimatedDuration: parseInt(editForm.estimatedDuration) || 0,
      estimatedDistance: parseFloat(editForm.estimatedDistance) || 0,
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsEditing(false);
      setIsEditingStops(false);
      setIsEditingFares(false);
    }
    onOpenChange(newOpen);
  };

  const addEditStop = () => {
    setEditStops(prev => [
      ...prev,
      { name: "", sequence: prev.length + 1, latitude: "", longitude: "" }
    ]);
  };

  const removeEditStop = (index: number) => {
    setEditStops(prev => {
      const newStops = [...prev];
      newStops.splice(index, 1);
      return newStops.map((s, i) => ({ ...s, sequence: i + 1 }));
    });
  };

  const updateEditStop = (index: number, field: string, value: string | number) => {
    setEditStops(prev => {
      const newStops = [...prev];
      newStops[index] = { ...newStops[index], [field]: value };
      return newStops;
    });
  };

  const updateFareAmount = (index: number, amount: string) => {
    setEditFares(prev => {
      const newFares = [...prev];
      newFares[index] = { ...newFares[index], amount };
      return newFares;
    });
  };

  const handleUpdateStops = () => {
    updateStops({
      stops: editStops.map((s, i) => {
        const originalStop = route?.stops?.find(orig => orig.sequence === i + 1);
        let stopNameObj = { en: s.name, am: s.name };

        if (originalStop && typeof originalStop.name === "object" && originalStop.name !== null) {
          stopNameObj = {
            en: originalStop.name.en || s.name,
            am: originalStop.name.am || s.name,
            [locale]: s.name
          };
        } else if (originalStop && typeof originalStop.name === "string") {
          stopNameObj = {
            en: originalStop.name,
            am: s.name,
            [locale]: s.name
          };
        }

        return {
          name: stopNameObj,
          sequence: i + 1,
          latitude: parseFloat(s.latitude as any) || 0,
          longitude: parseFloat(s.longitude as any) || 0,
        };
      })
    });
  };

  const handleUpdateFares = () => {
    updateFaresMutation({
      fares: editFares.map(f => ({
        fromStopSequence: f.fromStopSequence,
        toStopSequence: f.toStopSequence,
        amount: parseFloat(f.amount as any) || 0
      }))
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4 text-left">
          {isLoading || !route ? (
            <>
              <DialogTitle className="text-xl text-slate-300 animate-pulse">
                {t("detail_title_loading")}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {t("detail_desc_loading")}
              </DialogDescription>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-1 pr-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-[11px] ring-1 ring-primary/20 shrink-0">
                  {route.routeNumber}
                </div>
                <div>
                  <DialogTitle className="text-xl leading-tight">
                    {typeof route.name === "object" ? (route.name[locale] || route.name["en"]) : route.name}
                  </DialogTitle>
                  <DialogDescription className="mt-0.5">
                    {typeof route.description === "object" ? (route.description[locale] || route.description["en"]) : (route.description ?? "No description provided.")}
                  </DialogDescription>
                </div>
                <span
                  className={`ml-auto px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                    route.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {route.isActive ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {t("status_active")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> {t("status_inactive")}
                    </span>
                  )}
                </span>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="ml-2 gap-1.5 h-8">
                    <Edit2 className="w-3.5 h-3.5" /> {t("btn_edit")}
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogHeader>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-slate-400">{t("detail_fetching")}</p>
          </div>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Navigation2 className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-sm font-medium text-slate-500">{t("detail_not_found")}</p>
            <p className="text-xs text-slate-400 mt-1">
              {t("detail_not_found_desc")}
            </p>
          </div>
        )}

        {/* Edit Form */}
        {isEditing && route && (
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">{t("label_route_name")}</label>
              <Input value={editForm.name} onChange={e => setEditForm(p => ({...p, name: e.target.value}))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">{t("label_description")}</label>
              <Textarea value={editForm.description} onChange={e => setEditForm(p => ({...p, description: e.target.value}))} className="min-h-[80px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">{t("label_estimated_distance")}</label>
                <Input type="number" step="0.1" value={editForm.estimatedDistance} onChange={e => setEditForm(p => ({...p, estimatedDistance: e.target.value}))} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">{t("label_estimated_duration")}</label>
                <Input type="number" value={editForm.estimatedDuration} onChange={e => setEditForm(p => ({...p, estimatedDuration: e.target.value}))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase block">{t("label_status")}</label>
              <select className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30" value={editForm.isActive ? "true" : "false"} onChange={e => setEditForm(p => ({...p, isActive: e.target.value === "true"}))}>
                <option value="true">{t("status_active")}</option>
                <option value="false">{t("status_inactive")}</option>
              </select>
            </div>
            <div className="flex items-center pt-4 border-t border-slate-100">
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (confirm(t("confirm_delete"))) {
                    remove(routeId!);
                  }
                }} 
                disabled={isUpdating || isDeleting}
                className="gap-2"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDeleting ? t("btn_deleting") : t("btn_delete_route")}
              </Button>
              <div className="flex-1" />
              <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isUpdating || isDeleting}>{t("btn_cancel")}</Button>
              <Button onClick={handleUpdate} disabled={isUpdating || isDeleting} className="gap-2 ml-2" variant="outline">
                {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                {isUpdating ? t("btn_saving") : t("btn_save_changes")}
              </Button>
            </div>
          </div>
        )}

        {/* Content */}
        {route && !isLoading && !isEditing && (
          <div className="space-y-6 py-2">
            {/* ── Metrics grid ──────────────────────────────────────────── */}
            <section>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] mb-3">
                {t("title_metrics")}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <MetricCard
                  icon={Ruler}
                  label={t("label_total_distance")}
                  value={formatDistance(route.distance)}
                />
                <MetricCard
                  icon={Clock}
                  label={t("label_total_duration")}
                  value={formatDuration(route.duration)}
                />
                <MetricCard
                  icon={MapPin}
                  label={t("label_total_stops")}
                  value={t(route.totalStops === 1 ? "stop_count_single" : "stop_count_plural", { count: route.totalStops })}
                />
                <MetricCard
                  icon={Banknote}
                  label={t("label_base_fare")}
                  value={formatPrice(route.price)}
                  accent="bg-amber-50 text-amber-600"
                />
                <MetricCard
                  icon={Hash}
                  label={t("label_route_number")}
                  value={route.routeNumber}
                  accent="bg-violet-50 text-violet-600"
                />
                <MetricCard
                  icon={Calendar}
                  label={t("label_created")}
                  value={formatDate(route.createdAt)}
                  accent="bg-slate-100 text-slate-500"
                />
              </div>
            </section>

            {/* ── Origin → Destination summary ──────────────────────────── */}
            <section className="flex items-center gap-3 bg-primary/5 border border-primary/10 rounded-xl px-4 py-3">
              <div className="text-center shrink-0">
                <p className="text-[9px] font-bold text-primary/60 uppercase tracking-wider mb-0.5">
                  {t("label_from")}
                </p>
                <p className="text-sm font-bold text-primary leading-tight">
                  {route.startStopName}
                </p>
              </div>
              <div className="flex-1 flex flex-col items-center gap-0.5">
                <div className="flex items-center gap-1 w-full">
                  <div className="h-px flex-1 bg-primary/20" />
                  <ArrowRight className="w-4 h-4 text-primary/50" />
                  <div className="h-px flex-1 bg-primary/20" />
                </div>
                <p className="text-[10px] text-primary/50">
                  {formatDistance(route.distance)} · {formatDuration(route.duration)}
                </p>
              </div>
              <div className="text-center shrink-0">
                <p className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-wider mb-0.5">
                  {t("label_to")}
                </p>
                <p className="text-sm font-bold text-emerald-700 leading-tight">
                  {route.endStopName}
                </p>
              </div>
            </section>



            {/* ── Stop Editor / Timeline ────────────────────────────────── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em]">
                  {t("title_timeline", { count: route.stops?.length || 0 })}
                </h4>
                {!isEditingStops && !isEditingFares && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditingStops(true)} className="h-7 text-xs gap-1.5 px-2">
                      <Edit2 className="w-3 h-3" /> {t("btn_edit_stops")}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsEditingFares(true)} className="h-7 text-xs gap-1.5 px-2">
                      <Coins className="w-3 h-3" /> {t("btn_edit_fares")}
                    </Button>
                  </div>
                )}
              </div>

              {isEditingStops ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                  <div className="p-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs" dangerouslySetInnerHTML={{ __html: t("warning_updating_stops") }} />
                  
                  <div className="space-y-3">
                    {editStops.map((stop, index) => (
                      <div key={index} className="flex items-end gap-3 p-3 bg-white rounded-lg border border-slate-100 group relative">
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-12 gap-3">
                            <div className="col-span-1 flex flex-col items-center justify-center pt-5">
                              <div className="w-5 h-5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                                {stop.sequence}
                              </div>
                            </div>
                            <div className="col-span-11 space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase block">{t("label_stop_name")}</label>
                              <Input 
                                placeholder={t("placeholder_stop_name")}
                                value={stop.name}
                                onChange={e => updateEditStop(index, "name", e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 pl-8">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase block">{t("label_latitude")}</label>
                              <Input 
                                type="number" 
                                step="0.000001"
                                value={stop.latitude}
                                onChange={e => updateEditStop(index, "latitude", e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase block">{t("label_longitude")}</label>
                              <Input 
                                type="number" 
                                step="0.000001"
                                value={stop.longitude}
                                onChange={e => updateEditStop(index, "longitude", e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                        {editStops.length > 1 && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0 mb-[1px]"
                            onClick={() => removeEditStop(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button type="button" variant="outline" size="sm" onClick={addEditStop} className="w-full gap-1.5 border-dashed border-slate-300">
                    <Plus className="w-3.5 h-3.5" />
                    {t("btn_add_another_stop")}
                  </Button>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" onClick={() => setIsEditingStops(false)} disabled={isUpdatingStops} size="sm">{t("btn_cancel")}</Button>
                    <Button variant="outline" onClick={handleUpdateStops} disabled={isUpdatingStops} className="gap-2" size="sm">
                      {isUpdatingStops && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      {isUpdatingStops ? t("btn_saving") : t("btn_save_stops")}
                    </Button>
                  </div>
                </div>
              ) : isEditingFares ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                  <div className="p-3 bg-primary/5 text-primary border border-primary/10 rounded-lg text-xs" dangerouslySetInnerHTML={{ __html: t("fares_editor_desc") }} />
                  
                  <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-1">
                    {editFares.map((fare, index) => {
                      const fromStopVal = route.stops?.find(s => s.sequence === fare.fromStopSequence);
                      const toStopVal = route.stops?.find(s => s.sequence === fare.toStopSequence);
                      const fromStopName = fromStopVal
                        ? (typeof fromStopVal.name === "object" ? (fromStopVal.name[locale] || fromStopVal.name["en"]) : fromStopVal.name)
                        : t("stop_index", { index: fare.fromStopSequence });
                      const toStopName = toStopVal
                        ? (typeof toStopVal.name === "object" ? (toStopVal.name[locale] || toStopVal.name["en"]) : toStopVal.name)
                        : t("stop_index", { index: fare.toStopSequence });
                      
                      return (
                        <div key={index} className="flex items-center justify-between gap-4 p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 min-w-0">
                            <span className="truncate max-w-[120px] sm:max-w-[180px]">{fromStopName}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                            <span className="truncate max-w-[120px] sm:max-w-[180px] text-emerald-700">{toStopName}</span>
                          </div>
                          <div className="relative w-28 shrink-0">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">ETB</span>
                            <Input 
                              type="number"
                              step="0.1"
                              value={fare.amount}
                              onChange={e => updateFareAmount(index, e.target.value)}
                              className="h-8 text-xs pl-9 text-right font-bold pr-2 focus:ring-primary/20"
                              required
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" onClick={() => setIsEditingFares(false)} disabled={isUpdatingFares} size="sm">{t("btn_cancel")}</Button>
                    <Button variant="outline" onClick={handleUpdateFares} disabled={isUpdatingFares} className="gap-2" size="sm">
                      {isUpdatingFares && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      {isUpdatingFares ? t("btn_saving") : t("btn_save_fares")}
                    </Button>
                  </div>
                </div>
              ) : (
                route.stops && route.stops.length > 0 && (
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                    {route.stops
                      .slice()
                      .sort((a, b) => a.sequence - b.sequence)
                      .map((stop, idx, arr) => (
                        <StopItem 
                          key={stop.id} 
                          stop={stop} 
                          isLast={idx === arr.length - 1} 
                          fares={route.fares}
                        />
                      ))}
                  </div>
                )
              )}
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
