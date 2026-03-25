"use client";

interface TopUpActivityProps {
  t: (key: string) => string;
}

export function TopUpActivity({ t }: TopUpActivityProps) {
  return (
    <div className="bg-surface-container rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-on-surface">{t("top_up_activity")}</h4>
        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">LIVE</span>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-lg">trending_up</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">+450 ETB by SB-2104</p>
            <p className="text-[10px] text-on-surface-variant">2 mins ago</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-lg">trending_up</span>
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">+1,200 ETB Bulk Process</p>
            <p className="text-[10px] text-on-surface-variant">14 mins ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
