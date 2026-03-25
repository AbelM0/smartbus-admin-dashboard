"use client";

interface RoutePerformanceProps {
  t: (key: string) => string;
}

export function RoutePerformance({ t }: RoutePerformanceProps) {
  const routes = [
    { line: "Line 04", path: "Bole to Piazza (LRT)", eff: "94%", color: "bg-primary" },
    { line: "Line 12", path: "Megenagna to CMC", eff: "82%", color: "bg-slate-400" },
    { line: "Line 21", path: "Sarbet to Tor Hailoch", eff: "64%", color: "bg-red-400" }
  ];

  return (
    <div className="bg-white rounded-[20px] p-4.5 border border-outline-variant/10 shadow-sm flex-grow">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-black text-primary tracking-tight text-sm">{t("route_performance")}</h4>
        <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors text-lg">more_horiz</span>
      </div>
      <div className="space-y-6">
        {routes.map((route, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-primary/5 text-primary uppercase mb-1 inline-block">{route.line}</span>
                <p className="text-xs font-bold text-primary">{route.path}</p>
              </div>
              <span className="text-[10px] font-bold text-green-600">{route.eff} {t("efficiency")}</span>
            </div>
            <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className={`${route.color} h-full transition-all duration-1000 group-hover:opacity-80`} style={{ width: route.eff }}></div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-8 py-3 rounded-2xl bg-surface-container text-outline text-xs font-bold hover:bg-slate-200 transition-colors uppercase tracking-widest">
        {t("view_all_analytics")}
      </button>
    </div>
  );
}
