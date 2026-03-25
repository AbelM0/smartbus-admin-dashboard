"use client";

import { useTranslations } from "next-intl";
import { DashboardHeader } from "./_components/DashboardHeader";
import { MetricsGrid } from "./_components/MetricsGrid";
import { LiveFleetTracking } from "./_components/LiveFleetTracking";
import { RoutePerformance } from "./_components/RoutePerformance";
import { SystemAlert } from "./_components/SystemAlert";
import { RevenueTrends } from "./_components/RevenueTrends";

export default function Dashboard() {
  const t = useTranslations("dashboard");

  return (
    <div className="p-5 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <DashboardHeader t={t} />
      <MetricsGrid t={t} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LiveFleetTracking t={t} />
        <div className="space-y-6 flex flex-col">
          <RoutePerformance t={t} />
          <SystemAlert t={t} />
        </div>
      </div>

      <RevenueTrends t={t} />
    </div>
  );
}
