"use client";

interface AnalyticsHeaderProps {
  t: (key: string) => string;
}

export function AnalyticsHeader({ t }: AnalyticsHeaderProps) {
  return (
    <div className="lg:col-span-8">
      <h2 className="text-2xl font-extrabold tracking-tight text-on-surface mb-1.5">{t("title")}</h2>
      <p className="text-on-surface-variant text-sm mb-4">{t("description")}</p>
    </div>
  );
}
