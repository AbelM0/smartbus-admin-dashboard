"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTrip, useSuggestDrivers } from "@/hooks/trips";
import { useGetUsers } from "@/hooks/users";
import { useSearchRoutes } from "@/hooks/routes";
import { CalendarClock, Loader2, Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";
import { CreateTripPayload, AssignmentSuggestionsResponse } from "@/types/api/trips";
import { createTripSchema } from "@/lib/validation";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreateTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TripErrors = Partial<Record<keyof CreateTripPayload, string>>;

const EMPTY_FORM: CreateTripPayload = {
  routeId: "",
  driverId: "",
  scheduledFor: "",
  busIdentifier: "",
};

export function CreateTripDialog({ open, onOpenChange }: CreateTripDialogProps) {
  const locale = useLocale();
  const t = useTranslations("trips");
  const [formData, setFormData] = useState<CreateTripPayload>(EMPTY_FORM);
  const [errors, setErrors] = useState<TripErrors>({});
  const [suggestionsResponse, setSuggestionsResponse] = useState<AssignmentSuggestionsResponse["data"] | null>(null);

  const { data: routesData, isLoading: isLoadingRoutes } = useSearchRoutes({ limit: 100 });
  const { data: driversData, isLoading: isLoadingDrivers } = useGetUsers({ role: "DRIVER", status: "ACTIVE", limit: 100 });

  const routes = routesData?.data ?? [];
  const drivers = driversData?.data?.items ?? [];

  const { mutate: create, isPending } = useCreateTrip(() => {
    onOpenChange(false);
    setFormData(EMPTY_FORM);
    setErrors({});
    setSuggestionsResponse(null);
  });

  const { mutate: suggestDrivers, isPending: isSuggesting } = useSuggestDrivers();

  const clearError = (key: keyof CreateTripPayload) =>
    setErrors(prev => ({ ...prev, [key]: undefined }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = createTripSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        routeId: fieldErrors.routeId?.[0],
        driverId: fieldErrors.driverId?.[0],
        busIdentifier: fieldErrors.busIdentifier?.[0],
        scheduledFor: fieldErrors.scheduledFor?.[0],
      });
      return;
    }

    setErrors({});
    const isoDate = new Date(result.data.scheduledFor).toISOString();
    create({ ...result.data, scheduledFor: isoDate });
  };

  const handleSuggestDrivers = () => {
    if (!formData.routeId || !formData.scheduledFor) return;
    try {
      const isoDate = new Date(formData.scheduledFor).toISOString();
      suggestDrivers(
        { routeId: formData.routeId, scheduledFor: isoDate },
        {
          onSuccess: (res) => {
            if (res.success) setSuggestionsResponse(res.data);
          }
        }
      );
    } catch (e) {
      // invalid date handled by not parsing
    }
  };

  const canSuggest = formData.routeId && formData.scheduledFor && !isNaN(new Date(formData.scheduledFor).getTime());

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) {
        setSuggestionsResponse(null);
        setFormData(EMPTY_FORM);
        setErrors({});
      }
    }}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-primary" />
            {t("create_btn_schedule")}
          </DialogTitle>
          <DialogDescription>
            {t("create_dialog_description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Route */}
            <div className="space-y-1.5">
              <Label htmlFor="routeId">{t("create_label_route")}</Label>
              <select
                id="routeId"
                value={formData.routeId}
                onChange={e => { setFormData(prev => ({ ...prev, routeId: e.target.value })); clearError("routeId"); setSuggestionsResponse(null); }}
                className={`w-full h-10 px-3 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 ${errors.routeId ? "border-red-400" : "border-slate-200"}`}
                disabled={isLoadingRoutes}
              >
                <option value="" disabled>{t("create_placeholder_route")}</option>
                {routes.map(route => (
                  <option key={route.id} value={route.id}>
                    {route.routeNumber} - {(() => {
                      const name = route.name;
                      if (!name) return "";
                      if (typeof name === "object") {
                        return (name as Record<string, string>)[locale] || (name as Record<string, string>)["en"] || "";
                      }
                      if (typeof name === "string") {
                        try {
                          const parsed = JSON.parse(name);
                          if (parsed && typeof parsed === "object") {
                            return parsed[locale] || parsed["en"] || name;
                          }
                        } catch (e) {}
                        return name;
                      }
                      return name;
                    })()}
                  </option>
                ))}
              </select>
              {errors.routeId && <p className="text-xs text-red-500 mt-1">{errors.routeId}</p>}
            </div>

            {/* Scheduled For */}
            <div className="space-y-1.5">
              <Label htmlFor="scheduledFor">{t("create_label_schedule")}</Label>
              <Input
                id="scheduledFor"
                type="datetime-local"
                value={formData.scheduledFor}
                onChange={e => { setFormData(prev => ({ ...prev, scheduledFor: e.target.value })); clearError("scheduledFor"); setSuggestionsResponse(null); }}
                className={errors.scheduledFor ? "border-red-400 focus-visible:ring-red-400" : ""}
              />
              {errors.scheduledFor && <p className="text-xs text-red-500 mt-1">{errors.scheduledFor}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Driver */}
            <div className="space-y-1.5">
              <Label htmlFor="driverId">{t("create_label_driver")}</Label>
              <select
                id="driverId"
                value={formData.driverId}
                onChange={e => { setFormData(prev => ({ ...prev, driverId: e.target.value })); clearError("driverId"); }}
                className={`w-full h-10 px-3 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 ${errors.driverId ? "border-red-400" : "border-slate-200"}`}
                disabled={isLoadingDrivers}
              >
                <option value="" disabled>{t("create_placeholder_driver")}</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.fullName} ({driver.phone})
                  </option>
                ))}
              </select>
              {errors.driverId && <p className="text-xs text-red-500 mt-1">{errors.driverId}</p>}
            </div>

            {/* Bus Identifier */}
            <div className="space-y-1.5">
              <Label htmlFor="busIdentifier">{t("create_label_bus")}</Label>
              <Input
                id="busIdentifier"
                placeholder={t("create_placeholder_bus")}
                value={formData.busIdentifier}
                onChange={e => { setFormData(prev => ({ ...prev, busIdentifier: e.target.value })); clearError("busIdentifier"); }}
                className={errors.busIdentifier ? "border-red-400 focus-visible:ring-red-400" : ""}
              />
              {errors.busIdentifier && <p className="text-xs text-red-500 mt-1">{errors.busIdentifier}</p>}
            </div>
          </div>

          {/* ML Suggestions Trigger */}
          <div className="pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              className="w-full gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 border border-indigo-100"
              onClick={handleSuggestDrivers}
              disabled={!canSuggest || isSuggesting}
            >
              {isSuggesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {t("btn_suggest_drivers")}
            </Button>

            {/* Suggestions Results */}
            {suggestionsResponse && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {t("suggest_select_prompt")}
                  </span>
                  {suggestionsResponse.source === "fallback" && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {t("suggest_heuristic_mode")}
                    </Badge>
                  )}
                </div>

                {suggestionsResponse.suggestions.length === 0 ? (
                  <div className="p-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <p className="text-sm text-slate-500">{t("suggest_no_drivers")}</p>
                  </div>
                ) : (
                  <ScrollArea className="max-h-[220px] pr-3 -mr-3">
                    <div className="space-y-2">
                      {suggestionsResponse.suggestions.map((suggestion) => {
                        const isSelected = formData.driverId === suggestion.driverId;
                        const isHighConfidence = suggestion.confidence >= 0.75;
                        const isMediumConfidence = suggestion.confidence >= 0.4 && suggestion.confidence < 0.75;
                        const confidenceColor = isHighConfidence ? "bg-emerald-500" : isMediumConfidence ? "bg-amber-500" : "bg-red-500";
                        const confidencePercent = Math.round(suggestion.confidence * 100);

                        return (
                          <div
                            key={suggestion.driverId}
                            onClick={() => { 
                              setFormData(prev => ({ ...prev, driverId: suggestion.driverId })); 
                              clearError("driverId"); 
                              setSuggestionsResponse(null); 
                            }}
                            className={`p-3 border rounded-xl cursor-pointer transition-all duration-200 group ${
                              isSelected 
                                ? "border-indigo-500 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500/20" 
                                : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {isSelected ? (
                                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border border-slate-300 group-hover:border-indigo-400" />
                                )}
                                <span className={`text-sm font-bold ${isSelected ? "text-indigo-900" : "text-slate-800"}`}>
                                  {suggestion.driverName}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                {confidencePercent}% match
                                <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                                  <div className={`h-full rounded-full ${confidenceColor}`} style={{ width: `${confidencePercent}%` }} />
                                </div>
                              </div>
                            </div>
                            {suggestion.reasons.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pl-6">
                                {suggestion.reasons.map((reason, idx) => (
                                  <Badge key={idx} variant="secondary" className="bg-white border-slate-200 text-slate-600 font-normal text-[10px] leading-tight px-1.5">
                                    {reason}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100 mt-6">
            <Button type="button" variant="ghost" onClick={() => { onOpenChange(false); setErrors({}); }} disabled={isPending}>
              {t("create_btn_cancel")}
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2" variant="outline">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? t("create_btn_scheduling") : t("create_btn_schedule")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
