"use client";

import { useTranslations } from "next-intl";
import { DashboardHeader } from "./_components/DashboardHeader";
import { MetricsGrid } from "./_components/MetricsGrid";
import { QuickActions } from "./_components/QuickActions";
import { RoutePerformance } from "./_components/RoutePerformance";
import { RevenueTrends } from "./_components/RevenueTrends";

export default function Dashboard() {
  const t = useTranslations("dashboard");

  return (
    <div className="animate-in fade-in duration-700 space-y-8">

      <DashboardHeader t={t} />

      
      <MetricsGrid t={t} />

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <RevenueTrends t={t} />
        </div>
        <div className="lg:col-span-4 space-y-8 flex flex-col">
          <RoutePerformance t={t} />
        </div>
      </div>
    </div>
  );
}


