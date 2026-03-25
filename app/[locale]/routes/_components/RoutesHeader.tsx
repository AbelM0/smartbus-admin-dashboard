"use client";

interface RoutesHeaderProps {
  t: (key: string) => string;
}

export function RoutesHeader({ t }: RoutesHeaderProps) {
  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <span className="text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-1.5 block">{t("system_overview")}</span>
        <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">{t("title")}</h2>
        <p className="text-on-surface-variant mt-1.5 max-w-xl text-sm">{t("description")}</p>
      </div>
      <div className="flex gap-3">
        <div className="px-4 py-2.5 bg-surface-container rounded-xl">
          <p className="text-[10px] font-bold text-outline uppercase">{t("active_buses")}</p>
          <p className="text-xl font-black text-primary tracking-tighter">142 <span className="text-[10px] font-medium text-tertiary-container">+12%</span></p>
        </div>
        <div className="px-4 py-2.5 bg-primary text-white rounded-xl">
          <p className="text-[10px] font-bold opacity-70 uppercase">{t("daily_efficiency")}</p>
          <p className="text-xl font-black tracking-tighter">98.4%</p>
        </div>
      </div>
    </section>
  );
}
