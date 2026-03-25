"use client";

import { useTranslations } from "next-intl";
import { AnalyticsHeader } from "./_components/AnalyticsHeader";
import { AnalyticsMetrics } from "./_components/AnalyticsMetrics";
import { PopularRoutes } from "./_components/PopularRoutes";
import { UsageTrends } from "./_components/UsageTrends";
import { RecentReports } from "./_components/RecentReports";

const reports = [
  { name: "Monthly_Financial_Aug23", type: "Financial Summary", date: "Sept 01, 2023", status: "Completed", icon: "description" },
  { name: "Rider_Density_Analysis", type: "Operational Data", date: "Aug 28, 2023", status: "Completed", icon: "analytics" },
  { name: "Delay_Metric_Q3_Draft", type: "Performance Metric", date: "Aug 15, 2023", status: "Archived", icon: "speed" },
];

const popularRoutes = [
  { name: "Downtown Express R-101", sub: "Merkato - Bole via Stadium", volume: "8,240 pkts", color: "bg-primary" },
  { name: "East-West Connector", sub: "Megenagna - Ayer Tena", volume: "6,110 pkts", color: "bg-secondary" },
  { name: "Airport Link A-01", sub: "Bole Int'l - Piazza", volume: "4,950 pkts", color: "bg-tertiary" },
];

export default function AnalyticsPage() {
  const t = useTranslations("analytics");

  return (
    <div className="flex-1 p-5 space-y-6">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <AnalyticsHeader t={t} />
          <AnalyticsMetrics t={t} />
        </div>
        <PopularRoutes t={t} routes={popularRoutes} />
      </section>

      <UsageTrends t={t} />
      <RecentReports t={t} reports={reports} />
    </div>
  );
}
