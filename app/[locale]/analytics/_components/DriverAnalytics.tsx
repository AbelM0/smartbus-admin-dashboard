"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useGetUsers, useGetUserMetrics } from "@/hooks/users";
import { 
  Loader2, 
  UserCircle2, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Zap, 
  Award, 
  Activity 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DriverAnalytics() {
  const t = useTranslations("analytics");
  const locale = useLocale();
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  // Fetch all active drivers
  const { data: driversData, isLoading: isLoadingDrivers, isError: isErrorDrivers } = useGetUsers({
    role: "DRIVER",
    status: "ACTIVE",
    limit: 100
  });

  const drivers = driversData?.data?.items ?? [];

  // Default to the first driver when list loads
  useEffect(() => {
    if (drivers.length > 0 && !selectedDriverId) {
      setSelectedDriverId(drivers[0].id);
    }
  }, [drivers, selectedDriverId]);

  // Fetch metrics for selected driver
  const { data: metricsResponse, isLoading: isLoadingMetrics, isError: isErrorMetrics } = useGetUserMetrics(
    selectedDriverId
  );

  const metrics = metricsResponse?.data;
  const selectedDriver = drivers.find(d => d.id === selectedDriverId);

  if (isLoadingDrivers) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-slate-500 font-medium">{t("loading_analytics")}</p>
      </div>
    );
  }

  if (isErrorDrivers || drivers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-200 rounded-2xl bg-slate-50 text-center p-6">
        <UserCircle2 className="w-10 h-10 text-slate-300 mb-2" />
        <p className="text-sm font-bold text-slate-500">{t("no_drivers") || "No active drivers found."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Selector Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            {t("tab_drivers") || "Driver Performance"}
          </h3>
          <p className="text-xs text-slate-500">
            {t("tab_drivers_desc") || "Monitor overall driver efficiency, punctuality, and workload metrics."}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <label htmlFor="driver-select" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {t("select_driver") || "Select Driver"}:
          </label>
          <select
            id="driver-select"
            value={selectedDriverId || ""}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            className="w-full sm:w-[260px] h-10 px-3 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-slate-300 font-medium transition-all"
          >
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Driver Profile Card */}
        <div className="lg:col-span-4">
          {selectedDriver ? (
            <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden h-full">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-5 pt-6 px-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-lg">
                    {selectedDriver.fullName.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-800 leading-snug">{selectedDriver.fullName}</CardTitle>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                        {t("driver_profile") || "Driver Profile"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 px-6">
                <div className="space-y-3">
                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{t("label_phone") || "Phone"}</p>
                      <p className="text-xs font-semibold text-slate-700">{selectedDriver.phone}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{t("label_email") || "Email"}</p>
                      <p className="text-xs font-semibold text-slate-700 truncate">{selectedDriver.email || t("no_email") || "No Email Provided"}</p>
                    </div>
                  </div>

                  {/* FID / Identifier */}
                  {selectedDriver.fid && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <Award className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{t("label_fid") || "FID"}</p>
                        <p className="text-xs font-mono font-bold text-slate-700 uppercase tracking-tight">{selectedDriver.fid}</p>
                      </div>
                    </div>
                  )}

                  {/* Joined Date */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{t("label_joined") || "Joined"}</p>
                      <p className="text-xs font-semibold text-slate-700">
                        {new Date(selectedDriver.createdAt).toLocaleDateString(locale === "am" ? "am-ET" : "en-GB", { 
                          day: "2-digit",
                          month: "short", 
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Last Activity */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{t("label_last_active") || "Last Activity"}</p>
                      <p className="text-xs font-semibold text-slate-700">
                        {selectedDriver.lastLoginAt 
                          ? new Date(selectedDriver.lastLoginAt).toLocaleString(locale === "am" ? "am-ET" : "en-GB", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : t("last_active_never") || "Never"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        {/* Right Column: Driver Metrics Dashboard */}
        <div className="lg:col-span-8">
          {isLoadingMetrics ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center space-y-3 h-full">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-xs text-slate-400 font-medium">{t("fetching_driver_stats") || "Fetching driver operational stats..."}</p>
            </div>
          ) : isErrorMetrics ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center space-y-2 h-full text-error">
              <AlertTriangle className="w-8 h-8" />
              <p className="text-sm font-bold">{t("failed_driver_stats") || "Failed to load statistics for this driver."}</p>
            </div>
          ) : metrics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Trip Completion Rate */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">
                      {t("metric_completion_rate") || "Completion Rate"}
                    </span>
                    <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-3xl font-black text-slate-800 tracking-tighter">{(metrics.tripCompletionRate * 100).toFixed(1)}%</p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {t("metric_completion_rate_desc") || "Completed vs scheduled trips"}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-emerald-50 rounded-full h-2 mt-4 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${metrics.tripCompletionRate * 100}%` }} />
                </div>
              </div>

              {/* Average Trip Delay */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider">
                      {t("metric_avg_delay") || "Avg. Trip Delay"}
                    </span>
                    <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-3xl font-black text-slate-800 tracking-tighter">
                      {metrics.averageTripDelayMinutes.toFixed(1)}
                      <span className="text-sm font-bold ml-1 text-slate-400">{t("unit_minutes") || "min"}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {t("metric_avg_delay_desc") || "Average delay behind schedule"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5">
                  <span className={cn(
                    "inline-block w-2 h-2 rounded-full",
                    metrics.averageTripDelayMinutes <= 5 ? "bg-emerald-500" : "bg-amber-500"
                  )} />
                  <span className="text-[10px] font-bold text-slate-600">
                    {metrics.averageTripDelayMinutes <= 5 
                      ? t("status_excellent_punctuality") || "Excellent Punctuality" 
                      : t("status_moderate_delays") || "Moderate Delays"}
                  </span>
                </div>
              </div>

              {/* Average Passenger Load */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                      {t("metric_passenger_load") || "Passenger Load"}
                    </span>
                    <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-3xl font-black text-slate-800 tracking-tighter">
                      {metrics.averagePassengerLoad.toFixed(1)}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {t("metric_passenger_load_desc") || "Avg. passengers per active trip"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-[10px] font-bold text-slate-600">
                    {t("status_optimal_capacity") || "Optimal vehicle capacity"}
                  </span>
                </div>
              </div>

              {/* Workload (7d) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-500" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-violet-600 uppercase tracking-wider">
                      {t("metric_workload") || "Workload (7d)"}
                    </span>
                    <div className="p-1.5 bg-violet-50 rounded-lg text-violet-600">
                      <Activity className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-3xl font-black text-slate-800 tracking-tighter">
                      {metrics.recentAssignmentCount}
                      <span className="text-sm font-bold ml-1 text-slate-400">{t("unit_trips") || "trips"}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {t("metric_workload_desc") || "Assignments last 7 days"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-600">
                    {t("status_active_assignments") || "Active assignments"}
                  </span>
                </div>
              </div>

              {/* Anomaly Rate */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-wider">
                      {t("metric_anomaly_rate") || "Anomaly Rate"}
                    </span>
                    <div className="p-1.5 bg-rose-50 rounded-lg text-rose-600">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-3xl font-black text-slate-800 tracking-tighter">{(metrics.anomalyRate * 100).toFixed(1)}%</p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {t("metric_anomaly_rate_desc") || "Cancellations + severe delays ratio"}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-rose-50 rounded-full h-2 mt-4 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(metrics.anomalyRate * 100, 100)}%` }} />
                </div>
              </div>

              {/* Peak Hour Ratio */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-500" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                      {t("metric_peak_hour") || "Peak Hour Ratio"}
                    </span>
                    <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600">
                      <Zap className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-3xl font-black text-slate-800 tracking-tighter">{(metrics.peakHourRatio * 100).toFixed(0)}%</p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {t("metric_peak_hour_desc") || "Trips scheduled during rush hour"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={cn(
                    "inline-block w-2.5 h-2.5 rounded-full shadow-sm",
                    metrics.peakHourBinary ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300'
                  )} />
                  <span className="text-[10px] font-bold text-slate-700">
                    {metrics.peakHourBinary 
                      ? t("status_rush_hour") || "Rush Hour Scheduled" 
                      : t("status_off_peak") || "Off-Peak"}
                  </span>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center space-y-2 h-full text-center">
              <BarChart3 className="w-8 h-8 text-slate-300" />
              <p className="text-xs text-slate-400 font-medium">
                {t("no_data_available") || "No analytics data available for this driver."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
