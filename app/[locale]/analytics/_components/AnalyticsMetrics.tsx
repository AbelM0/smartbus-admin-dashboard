import { Card, CardContent } from "@/components/ui/card";
import { AnalyticsData } from "@/types/api/analytics";

interface AnalyticsMetricsProps {
  t: (key: string) => string;
  data?: AnalyticsData;
}

export function AnalyticsMetrics({ t, data }: AnalyticsMetricsProps) {
  const metrics = [
    { 
      label: t("net_revenue"), 
      value: data?.netRevenue?.toLocaleString() ?? "0", 
      unit: "ETB", 
      icon: "payments", 
      status: "Live", 
      statusColor: "text-tertiary", 
      statusBg: "bg-tertiary-fixed", 
      iconBg: "bg-secondary-fixed", 
      iconColor: "text-on-secondary-container" 
    },
    { 
      label: t("tickets_purchased"), 
      value: data?.totalTicketsPurchased?.toLocaleString() ?? "0", 
      unit: "Pkts", 
      icon: "confirmation_number", 
      status: "Period", 
      statusColor: "text-primary", 
      statusBg: "bg-primary-fixed", 
      iconBg: "bg-primary-fixed", 
      iconColor: "text-on-primary-fixed" 
    },
    { 
      label: t("active_users"), 
      value: data?.activeUsersInPeriod?.toLocaleString() ?? "0", 
      unit: "Users", 
      icon: "group", 
      status: `${data?.totalUsers ?? 0} Total`, 
      statusColor: "text-emerald-700", 
      statusBg: "bg-emerald-100", 
      iconBg: "bg-emerald-100", 
      iconColor: "text-emerald-700" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {metrics.map((metric, i) => (
        <Card key={i} className="bg-surface-container-low border-none shadow-none rounded-lg transition-all hover:translate-y-[-2px]">
          <CardContent className="p-4.5">
            <div className="flex justify-between items-start mb-3">
              <div className={`p-1.5 ${metric.iconBg} rounded-md flex items-center justify-center`}>
                <span className={`material-symbols-outlined ${metric.iconColor} text-lg`}>{metric.icon}</span>
              </div>
              <span className={`text-[9px] font-bold ${metric.statusColor} px-1.5 py-0.5 ${metric.statusBg} rounded-full`}>{metric.status}</span>
            </div>
            <p className="text-xs font-medium text-on-surface-variant mb-0.5">{metric.label}</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-on-surface tracking-tighter">{metric.value}</span>
              <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">{metric.unit}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

