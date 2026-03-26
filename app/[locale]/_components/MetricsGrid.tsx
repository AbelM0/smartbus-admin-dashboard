"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricsGridProps {
  t: (key: string) => string;
}

export function MetricsGrid({ t }: MetricsGridProps) {
  const stats = [
    { label: t("total_users"), value: "14.2k", trend: "+12%", icon: "group" },
    { label: t("tickets_sold"), value: "84.4k", icon: "confirmation_number" },
    { label: t("revenue"), value: "ETB 14.8M", icon: "payments" },
    { label: t("active_routes"), value: "42", icons: ["04", "12"] }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="rounded-2xl border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-surface-container-lowest">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4.5">
            <CardTitle className="text-outline font-bold text-[10px] uppercase tracking-wider">
              {stat.label}
            </CardTitle>
            {stat.icon && <span className="material-symbols-outlined text-primary/40 text-lg">{stat.icon}</span>}
            {stat.icons && (
              <div className="flex -space-x-1.5">
                {stat.icons.map(ic => (
                  <div key={ic} className="w-5 h-5 rounded-full bg-primary text-white text-[7px] flex items-center justify-center font-bold border-2 border-white ring-1 ring-primary/10">{ic}</div>
                ))}
              </div>
            )}
          </CardHeader>
          <CardContent className="flex items-end justify-between pb-4 px-4.5">
            <h3 className="text-xl font-black text-primary tracking-tighter leading-none">{stat.value}</h3>
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
