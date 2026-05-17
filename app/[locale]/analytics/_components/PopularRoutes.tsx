"use client";

import { useGetRevenueBreakdown } from "@/hooks/analytics";
import { Loader2, Trophy } from "lucide-react";

interface PopularRoutesProps {
  t: (key: string) => string;
}

export function PopularRoutes({ t }: PopularRoutesProps) {
  const { data: revenueResponse, isLoading } = useGetRevenueBreakdown();
  
  const routes = revenueResponse?.data?.byRoute ?? [];
  const colors = ["bg-primary", "bg-secondary", "bg-tertiary", "bg-emerald-500", "bg-amber-500"];

  return (
    <div className="lg:col-span-4 bg-surface-container p-4.5 rounded-lg border border-outline-variant/10 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-extrabold text-on-surface">{t("popularity")}</h3>
        </div>
      </div>

      <div className="flex-1 space-y-3 min-h-[200px]">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Calculating...</p>
          </div>
        ) : routes.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[10px] text-slate-400 font-medium italic p-4 text-center">
            No route activity recorded.
          </div>
        ) : (
          routes.map((route, i) => (
            <div key={route.routeId} className="flex items-center justify-between p-2.5 bg-surface-container-lowest rounded-md border border-slate-100/50 hover:border-primary/20 transition-colors group">
              <div className="flex items-center gap-2.5">
                <div className={`w-1 h-7 ${colors[i % colors.length]} rounded-full group-hover:scale-y-110 transition-transform`}></div>
                <div>
                  <p className="text-xs font-bold text-on-surface leading-tight">{route.routeNumber}</p>
                  <p className="text-[9px] text-on-surface-variant leading-tight">{route.routeName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-primary">{route.revenue.toLocaleString()}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">ETB</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

