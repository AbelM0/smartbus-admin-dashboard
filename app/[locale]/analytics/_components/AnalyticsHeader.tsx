"use client";

interface AnalyticsHeaderProps {
  t: (key: string) => string;
  period?: { from: string; to: string };
}

export function AnalyticsHeader({ t, period }: AnalyticsHeaderProps) {
  return (
    <div className="lg:col-span-8">
      <h2 className="text-2xl font-extrabold tracking-tight text-on-surface mb-1.5">{t("title")}</h2>
      <p className="text-on-surface-variant text-sm mb-4">
        {t("description")} 
        {period && (
          <span className="ml-1 font-bold text-primary">
            ({period.from} {t("to")} {period.to})
          </span>
        )}
      </p>
    </div>
  );
}



