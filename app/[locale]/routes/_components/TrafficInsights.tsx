"use client";

interface TrafficInsightsProps {
  t: (key: string) => string;
}

export function TrafficInsights({ t }: TrafficInsightsProps) {
  return (
    <div className="bg-surface-container rounded-xl p-5 flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold mb-3">{t("traffic_insights")}</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-lg">bolt</span>
            </div>
            <div>
              <p className="text-xs font-bold">Peak Efficiency</p>
              <p className="text-[10px] text-on-surface-variant">07:00 - 09:30 AM</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-lg">warning</span>
            </div>
            <div>
              <p className="text-xs font-bold text-error">Congestion Alert</p>
              <p className="text-[10px] text-on-surface-variant">Megenagna Square (15m delay)</p>
            </div>
          </div>
        </div>
      </div>
      <button className="w-full py-2 bg-surface-container-highest text-primary text-sm font-bold rounded-lg hover:bg-surface-variant transition-colors">
        {t("view_details")}
      </button>
    </div>
  );
}
