"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateRoute } from "@/hooks/routes";
import { Plus, Trash2, MapPin, Navigation, Info, CircleDollarSign, Loader2, ArrowRight } from "lucide-react";
import { CreateRoutePayload, CreateRouteStopInput, CreateRouteFareInput, CreateRouteSegmentInput } from "@/types/api/routes";


interface CreateRouteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRouteDialog({ open, onOpenChange }: CreateRouteDialogProps) {
  const t = useTranslations("routes");
  const locale = useLocale();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CreateRoutePayload>({
    routeNumber: "",
    name: { en: "", am: "" },
    description: { en: "", am: "" },
    estimatedDuration: 0,
    estimatedDistance: 0,
    stops: [{ name: { en: "", am: "" }, sequence: 1, latitude: 0, longitude: 0 }],
    fares: [],
    segments: []
  });
  const [baseFare, setBaseFare] = useState<number>(20); // Default base fare 20 ETB

  const { mutate: create, isPending } = useCreateRoute(() => {
    onOpenChange(false);
    resetForm();
  });

  const resetForm = () => {
    setStep(1);
    setFormData({
      routeNumber: "",
      name: { en: "", am: "" },
      description: { en: "", am: "" },
      estimatedDuration: 0,
      estimatedDistance: 0,
      stops: [{ name: { en: "", am: "" }, sequence: 1, latitude: 0, longitude: 0 }],
      fares: [],
      segments: []
    });
    setBaseFare(20);
  };

  const addStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, { name: { en: "", am: "" }, sequence: prev.stops.length + 1, latitude: 0, longitude: 0 }]
    }));
  };

  const removeStop = (index: number) => {
    if (formData.stops.length <= 2) return; // Minimum 2 stops for a route
    const newStops = formData.stops.filter((_, i) => i !== index).map((stop, i) => ({
      ...stop,
      sequence: i + 1
    }));
    setFormData(prev => ({ ...prev, stops: newStops }));
  };

  const updateStop = (index: number, field: keyof CreateRouteStopInput, value: any) => {
    const newStops = [...formData.stops];
    newStops[index] = { ...newStops[index], [field]: value };
    setFormData(prev => ({ ...prev, stops: newStops }));
  };

  const updateFareAmount = (index: number, amount: string) => {
    setFormData(prev => {
      const newFares = [...prev.fares];
      newFares[index] = { ...newFares[index], amount: amount as any };
      return { ...prev, fares: newFares };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      // Transitioning to Step 3: Fares Customization!
      // Generate default proportional fares based on the defined stops and base fare
      const generatedFares: CreateRouteFareInput[] = [];
      const numStops = formData.stops.length;
      const baseFareNum = parseFloat(baseFare as any) || 0;

      for (let i = 1; i <= numStops; i++) {
        for (let j = i + 1; j <= numStops; j++) {
          const proportion = (j - i) / (numStops - 1);
          const amount = Number((proportion * baseFareNum).toFixed(2));
          generatedFares.push({
            fromStopSequence: i,
            toStopSequence: j,
            amount,
          });
        }
      }
      setFormData(prev => ({ ...prev, fares: generatedFares }));
      setStep(3);
      return;
    }
    
    // We are on Step 3: Submit!
    const estimatedDistanceNum = parseFloat(formData.estimatedDistance as any) || 0;
    const estimatedDurationNum = parseInt(formData.estimatedDuration as any) || 0;
    
    const numSegments = Math.max(1, formData.stops.length - 1);
    const segmentDistance = Number((estimatedDistanceNum / numSegments).toFixed(2));
    const segmentDuration = Math.round(estimatedDurationNum / numSegments);

    const generatedSegments: CreateRouteSegmentInput[] = [];
    for (let i = 0; i < formData.stops.length - 1; i++) {
      generatedSegments.push({
        fromStopSequence: i + 1,
        toStopSequence: i + 2,
        distance: Math.round(segmentDistance),
        duration: segmentDuration,
      });
    }

    const payload = {
      ...formData,
      estimatedDistance: estimatedDistanceNum,
      estimatedDuration: estimatedDurationNum,
      stops: formData.stops.map(s => ({
        ...s,
        latitude: parseFloat(s.latitude as any) || 0,
        longitude: parseFloat(s.longitude as any) || 0,
      })),
      fares: formData.fares.map(f => ({
        ...f,
        amount: parseFloat(f.amount as any) || 0
      })),
      segments: generatedSegments
    };
    
    create(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Navigation className="w-6 h-6 text-primary" />
            {t("create_title")}
          </DialogTitle>
          <DialogDescription>
            {t("step_indicator", {
              step,
              name: step === 1 
                ? t("step_general") 
                : step === 2 
                ? t("step_stops") 
                : t("step_fares")
            })}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="routeNumber">{t("label_route_number")}</Label>
                  <Input 
                    id="routeNumber" 
                    placeholder={t("placeholder_route_number")} 
                    value={formData.routeNumber}
                    onChange={e => setFormData(prev => ({ ...prev, routeNumber: e.target.value }))}
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="routeNameEn">{t("label_route_name_en")}</Label>
                  <Input 
                    id="routeNameEn" 
                    placeholder={t("placeholder_route_name_en")} 
                    value={formData.name.en}
                    onChange={e => setFormData(prev => ({ ...prev, name: { ...prev.name, en: e.target.value } }))}
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="routeNameAm">{t("label_route_name_am")}</Label>
                  <Input 
                    id="routeNameAm" 
                    placeholder={t("placeholder_route_name_am")} 
                    value={formData.name.am}
                    onChange={e => setFormData(prev => ({ ...prev, name: { ...prev.name, am: e.target.value } }))}
                    required 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="descriptionEn">{t("label_desc_en")}</Label>
                  <Textarea 
                    id="descriptionEn" 
                    placeholder={t("placeholder_desc_en")} 
                    className="min-h-[100px]"
                    value={formData.description?.en || ""}
                    onChange={e => setFormData(prev => ({ ...prev, description: { ...prev.description, en: e.target.value } as any }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="descriptionAm">{t("label_desc_am")}</Label>
                  <Textarea 
                    id="descriptionAm" 
                    placeholder={t("placeholder_desc_am")} 
                    className="min-h-[100px]"
                    value={formData.description?.am || ""}
                    onChange={e => setFormData(prev => ({ ...prev, description: { ...prev.description, am: e.target.value } as any }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="duration">{t("label_duration")}</Label>
                  <Input 
                    id="duration" 
                    type="number"
                    value={formData.estimatedDuration || ""}
                    onChange={e => setFormData(prev => ({ ...prev, estimatedDuration: e.target.value as any }))}
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="distance">{t("label_distance")}</Label>
                  <Input 
                    id="distance" 
                    type="number"
                    step="0.1"
                    value={formData.estimatedDistance || ""}
                    onChange={e => setFormData(prev => ({ ...prev, estimatedDistance: e.target.value as any }))}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <Label htmlFor="baseFare">{t("label_base_fare")}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">ETB</span>
                  <Input 
                    id="baseFare" 
                    type="number"
                    min="1"
                    step="0.5"
                    value={baseFare || ""}
                    onChange={e => setBaseFare(e.target.value as any)}
                    className="pl-10"
                    required 
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{t("base_fare_info")}</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{t("label_route_stops")}</h4>
                <Button type="button" variant="outline" size="sm" onClick={addStop} className="gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  {t("btn_add_stop")}
                </Button>
              </div>
              <div className="space-y-3">
                {formData.stops.map((stop, index) => (
                  <div key={index} className="flex items-end gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 group relative">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-1 flex flex-col items-center justify-center pt-6">
                          <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                            {stop.sequence}
                          </div>
                        </div>
                        <div className="col-span-11 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs">{t("label_stop_name_en")}</Label>
                            <Input 
                              placeholder={t("placeholder_stop_name_en")}
                              value={stop.name.en}
                              onChange={e => updateStop(index, "name", { ...stop.name, en: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">{t("label_stop_name_am")}</Label>
                            <Input 
                              placeholder={t("placeholder_stop_name_am")}
                              value={stop.name.am}
                              onChange={e => updateStop(index, "name", { ...stop.name, am: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pl-9">
                        <div className="space-y-1.5">
                          <Label className="text-[10px]">{t("label_latitude")}</Label>
                          <Input 
                            type="number" 
                            step="0.000001"
                            value={stop.latitude || ""}
                            onChange={e => updateStop(index, "latitude", e.target.value as any)}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px]">{t("label_longitude")}</Label>
                          <Input 
                            type="number" 
                            step="0.000001"
                            value={stop.longitude || ""}
                            onChange={e => updateStop(index, "longitude", e.target.value as any)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    {formData.stops.length > 2 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeStop(index)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl flex gap-3">
                <CircleDollarSign className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-primary">{t("label_fares_title")}</p>
                  <p className="text-xs text-primary/70">
                    {t("label_fares_desc", { baseFare })}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-1">
                {formData.fares.map((fare, index) => {
                  const fromStop = formData.stops[fare.fromStopSequence - 1];
                  const toStop = formData.stops[fare.toStopSequence - 1];
                  const fromStopName = fromStop
                    ? (typeof fromStop.name === "object"
                      ? (fromStop.name[locale] || fromStop.name["en"])
                      : fromStop.name)
                    : t("stop_index", { index: fare.fromStopSequence });
                  const toStopName = toStop
                    ? (typeof toStop.name === "object"
                      ? (toStop.name[locale] || toStop.name["en"])
                      : toStop.name)
                    : t("stop_index", { index: fare.toStopSequence });
                  
                  return (
                    <div key={index} className="flex items-center justify-between gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
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
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-6 border-t">
            {step > 1 && (
              <Button type="button" variant="ghost" onClick={() => setStep(step - 1)} disabled={isPending}>
                {t("btn_back")}
              </Button>
            )}
            <div className="flex-1" />
            <Button type="submit" disabled={isPending} className="gap-2" variant="outline">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {step < 3 ? (
                <>{t("btn_next")} <ArrowRight className="w-4 h-4" /></>
              ) : (
                t("btn_create_route")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
