"use client";

interface PopularRoute {
  name: string;
  sub: string;
  volume: string;
  color: string;
}

interface PopularRoutesProps {
  t: (key: string) => string;
  routes: PopularRoute[];
}

export function PopularRoutes({ t, routes }: PopularRoutesProps) {
  return (
    <div className="lg:col-span-4 bg-surface-container p-4.5 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-extrabold text-on-surface">{t("popularity")}</h3>
        <span className="material-symbols-outlined text-outline text-lg">more_vert</span>
      </div>
      <div className="space-y-3">
        {routes.map((route, i) => (
          <div key={i} className="flex items-center justify-between p-2.5 bg-surface-container-lowest rounded-md">
            <div className="flex items-center gap-2.5">
              <div className={`w-1 h-7 ${route.color} rounded-full`}></div>
              <div>
                <p className="text-xs font-bold text-on-surface leading-tight">{route.name}</p>
                <p className="text-[9px] text-on-surface-variant leading-tight">{route.sub}</p>
              </div>
            </div>
            <p className="text-xs font-black text-on-secondary-container">{route.volume}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
