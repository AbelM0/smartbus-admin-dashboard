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
import { useCreateTrip } from "@/hooks/trips";
import { useGetUsers } from "@/hooks/users";
import { useSearchRoutes } from "@/hooks/routes";
import { CalendarClock, Loader2 } from "lucide-react";
import { CreateTripPayload } from "@/types/api/trips";
import { createTripSchema } from "@/lib/validation";

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

  const { data: routesData, isLoading: isLoadingRoutes } = useSearchRoutes({ limit: 100 });
  const { data: driversData, isLoading: isLoadingDrivers } = useGetUsers({ role: "DRIVER", status: "ACTIVE", limit: 100 });

  const routes = routesData?.data ?? [];
  const drivers = driversData?.data?.items ?? [];

  const { mutate: create, isPending } = useCreateTrip(() => {
    onOpenChange(false);
    setFormData(EMPTY_FORM);
    setErrors({});
  });

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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
          {/* Route */}
          <div className="space-y-1.5">
            <Label htmlFor="routeId">{t("create_label_route")}</Label>
            <select
              id="routeId"
              value={formData.routeId}
              onChange={e => { setFormData(prev => ({ ...prev, routeId: e.target.value })); clearError("routeId"); }}
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
                      } catch (e) {
                        // ignore
                      }
                      return name;
                    }
                    return name;
                  })()}
                </option>
              ))}
            </select>
            {errors.routeId && <p className="text-xs text-red-500 mt-1">{errors.routeId}</p>}
          </div>

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

          {/* Scheduled For */}
          <div className="space-y-1.5">
            <Label htmlFor="scheduledFor">{t("create_label_schedule")}</Label>
            <Input
              id="scheduledFor"
              type="datetime-local"
              value={formData.scheduledFor}
              onChange={e => { setFormData(prev => ({ ...prev, scheduledFor: e.target.value })); clearError("scheduledFor"); }}
              className={errors.scheduledFor ? "border-red-400 focus-visible:ring-red-400" : ""}
            />
            {errors.scheduledFor && <p className="text-xs text-red-500 mt-1">{errors.scheduledFor}</p>}
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100">
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
