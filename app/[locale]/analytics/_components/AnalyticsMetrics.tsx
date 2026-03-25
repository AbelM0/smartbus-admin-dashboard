"use client";

interface AnalyticsMetricsProps {
  t: (key: string) => string;
}

export function AnalyticsMetrics({ t }: AnalyticsMetricsProps) {
  const metrics = [
    { label: t("total_revenue"), value: "842,500", unit: "ETB", icon: "payments", status: "Live", statusColor: "text-tertiary", statusBg: "bg-tertiary-fixed", iconBg: "bg-secondary-fixed", iconColor: "text-on-secondary-container" },
    { label: t("active_riders"), value: "18,240", unit: "Pkts", icon: "group", status: "+12%", statusColor: "text-primary", statusBg: "bg-primary-fixed", iconBg: "bg-primary-fixed", iconColor: "text-on-primary-fixed" },
    { label: t("fleet_delay"), value: "4.2", unit: "Mins", icon: "speed", status: "Delayed", statusColor: "text-error", statusBg: "bg-error-container", iconBg: "bg-error-container", iconColor: "text-on-error-container" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {metrics.map((metric, i) => (
        <div key={i} className="bg-surface-container-low p-4.5 rounded-lg transition-all hover:translate-y-[-2px]">
          <div className="flex justify-between items-start mb-3">
            <div className={`p-1.5 ${metric.iconBg} rounded-md`}>
              <span className={`material-symbols-outlined ${metric.iconColor} text-lg`}>{metric.icon}</span>
            </div>
            <span className={`text-[9px] font-bold ${metric.statusColor} px-1.5 py-0.5 ${metric.statusBg} rounded-full`}>{metric.status}</span>
          </div>
          <p className="text-xs font-medium text-on-surface-variant mb-0.5">{metric.label}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-on-surface tracking-tighter">{metric.value}</span>
            <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">{metric.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
