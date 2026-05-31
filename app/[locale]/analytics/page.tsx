"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnalyticsHeader } from "./_components/AnalyticsHeader";
import { AnalyticsMetrics } from "./_components/AnalyticsMetrics";
import { DetailedStats } from "./_components/DetailedStats";
import { PopularRoutes } from "./_components/PopularRoutes";
import { UsageTrends } from "./_components/UsageTrends";
import { TicketAnalytics } from "./_components/TicketAnalytics";
import { TripAnalytics } from "./_components/TripAnalytics";
import { AnomalyList } from "./_components/AnomalyList";
import { ExportReportsSection } from "./_components/ExportReportsSection";
import { DriverAnalytics } from "./_components/DriverAnalytics";
import { useGetAnalytics } from "@/hooks/analytics";
import { Loader2, LayoutDashboard, TrendingUp, Ticket, FileText, Bus, ShieldAlert, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const t = useTranslations("analytics");
  const [activeTab, setActiveTab] = useState<"overview" | "revenue" | "tickets" | "fleet" | "drivers" | "anomalies" | "reports">("overview");
  const { data: analyticsResponse, isLoading, isError } = useGetAnalytics();

  const data = analyticsResponse?.data;




  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-on-surface-variant font-medium">{t("loading_analytics")}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-error">
        <p className="text-sm font-bold">{t("error_loading")}</p>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: t("tab_overview"), icon: LayoutDashboard },
    { id: "revenue", label: t("tab_revenue"), icon: TrendingUp },
    { id: "tickets", label: t("tab_tickets"), icon: Ticket },
    { id: "fleet", label: t("tab_fleet"), icon: Bus },
    { id: "drivers", label: t("tab_drivers") || "Driver Performance", icon: UserCircle2 },
    { id: "anomalies", label: t("tab_anomalies"), icon: ShieldAlert },
    { id: "reports", label: t("tab_reports"), icon: FileText },
  ] as const;

  return (
    <div className="space-y-6">
      <AnalyticsHeader t={t} period={data?.period} />


      {/* Custom Premium Tabs */}
      <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-xl w-fit border border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200",
              activeTab === tab.id 
                ? "bg-white text-primary shadow-sm" 
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            )}
          >
            <tab.icon className={cn("w-3.5 h-3.5", activeTab === tab.id ? "text-primary" : "text-slate-400")} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                <AnalyticsMetrics t={t} data={data} />
                <DetailedStats t={t} data={data} />
              </div>
              <PopularRoutes t={t} />
            </section>
          </div>
        )}

        {activeTab === "revenue" && (
          <div className="space-y-6">
            <UsageTrends t={t} />
          </div>
        )}

        {activeTab === "tickets" && (
          <div className="space-y-6">
            <TicketAnalytics t={t} />
          </div>
        )}

        {activeTab === "fleet" && (
          <div className="space-y-6">
            <TripAnalytics t={t} />
          </div>
        )}

        {activeTab === "anomalies" && (
          <div className="space-y-6">
            <AnomalyList t={t} />
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-6">
            <ExportReportsSection t={t} />
          </div>
        )}

        {activeTab === "drivers" && (
          <div className="space-y-6">
            <DriverAnalytics />
          </div>
        )}
      </div>
    </div>
  );
}









