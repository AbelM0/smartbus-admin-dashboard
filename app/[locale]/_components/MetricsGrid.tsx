"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAnalytics } from "@/hooks/analytics";
import { Loader2 } from "lucide-react";

interface MetricsGridProps {
  t: (key: string) => string;
}

export function MetricsGrid({ t }: MetricsGridProps) {
  const { data: analyticsResponse, isLoading } = useGetAnalytics();
  const data = analyticsResponse?.data;

  const stats = [
    { 
      label: t("total_users"), 
      value: data?.totalUsers?.toLocaleString() ?? "0", 
      trend: data?.activeUsersInPeriod ? `+${data.activeUsersInPeriod} active` : null, 
      icon: "group" 
    },
    { 
      label: t("tickets_sold"), 
      value: data?.totalTicketsPurchased?.toLocaleString() ?? "0", 
      icon: "confirmation_number" 
    },
    { 
      label: t("revenue"), 
      value: `ETB ${data?.netRevenue?.toLocaleString() ?? "0"}`, 
      icon: "payments" 
    },
    { 
      label: t("active_routes"), 
      value: data?.totalTrips?.toLocaleString() ?? "0", 
      icon: "bus_alert"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="rounded-2xl border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-surface-container-lowest">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4.5">
            <CardTitle className="text-outline font-bold text-[10px] uppercase tracking-wider">
              {stat.label}
            </CardTitle>
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-primary/40 text-lg">{stat.icon}</span>
            )}
          </CardHeader>
          <CardContent className="flex items-end justify-between pb-4 px-4.5">
            <h3 className="text-xl font-black text-primary tracking-tighter leading-none">
              {isLoading ? "..." : stat.value}
            </h3>
            {stat.trend && (
              <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">
                {stat.trend}
              </span>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

