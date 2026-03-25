"use client";

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
        <div key={i} className="bg-white p-4.5 rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className="text-outline font-bold text-[10px] uppercase tracking-wider">{stat.label}</span>
            {stat.icon && <span className="material-symbols-outlined text-primary/40 text-lg">{stat.icon}</span>}
            {stat.icons && (
              <div className="flex -space-x-1.5">
                {stat.icons.map(ic => (
                  <div key={ic} className="w-5 h-5 rounded-full bg-primary text-white text-[7px] flex items-center justify-center font-bold border-2 border-white ring-1 ring-primary/10">{ic}</div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-xl font-black text-primary tracking-tighter">{stat.value}</h3>
            {stat.trend && (
              <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">
                {stat.trend}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
