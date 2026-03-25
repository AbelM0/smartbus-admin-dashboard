"use client";

interface SystemAlertProps {
  t: (key: string) => string;
}

export function SystemAlert({ t }: SystemAlertProps) {
  return (
    <div className="bg-primary rounded-[20px] p-4.5 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
      <div className="absolute -right-4 -bottom-4 opacity-10 transform group-hover:scale-110 transition-transform">
         <span className="material-symbols-outlined text-8xl">campaign</span>
      </div>
      <div className="flex justify-between items-start mb-3 relative z-10">
        <h4 className="font-black tracking-tight text-sm">{t("system_alert")}</h4>
        <button className="bg-white/20 p-1 rounded-lg hover:bg-white/40 transition-colors">
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
      <p className="text-xs text-secondary-fixed/80 leading-relaxed mb-6 relative z-10 font-medium">Scheduled maintenance for 14 buses in Fleet B starting tonight at 11:00 PM. Please adjust driver logs accordingly.</p>
      <button className="relative z-10 bg-white text-primary text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-sm hover:scale-[1.05] active:scale-[0.95] transition-all">
        {t("manage_schedule")}
      </button>
    </div>
  );
}
