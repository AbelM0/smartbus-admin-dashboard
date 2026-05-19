"use client";

interface DashboardHeaderProps {
  t: (key: string) => string;
}

export function DashboardHeader({ t }: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-end mb-4">
      <div>
        <h2 className="text-2xl font-black text-primary tracking-tight">{t("title")}</h2>
        <p className="text-outline text-xs font-medium mt-0.5">{t("subtitle")}</p>
      </div>
      <div className="flex space-x-2">
        <button className="flex items-center space-x-2 bg-white border border-outline-variant px-3 py-1.5 rounded-xl text-xs font-bold text-primary hover:bg-surface-bright transition-colors shadow-sm">
          <span className="material-symbols-outlined text-xs">calendar_today</span>
          <span>2016 E.C.</span>
        </button>
      </div>

    </div>
  );
}
