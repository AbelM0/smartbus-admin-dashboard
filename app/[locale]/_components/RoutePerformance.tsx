"use client";

import { useGetTripAnalytics } from "@/hooks/analytics";
import { Loader2, Bus } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

interface RoutePerformanceProps {
  t: (key: string) => string;
}

export function RoutePerformance({ t }: RoutePerformanceProps) {
  const locale = useLocale();
  const { data: tripResponse, isLoading } = useGetTripAnalytics();
  
  const routes = tripResponse?.data?.byRoute.slice(0, 3) ?? [];

  return (
    <div className="bg-white rounded-[20px] p-4.5 border border-outline-variant/10 shadow-sm flex-grow min-h-[300px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-black text-primary tracking-tight text-sm uppercase tracking-widest">{t("route_performance")}</h4>
        <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors text-lg">more_horiz</span>
      </div>
      
      <div className="space-y-6 flex-1">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Analyzing routes...</p>
          </div>
        ) : routes.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 italic text-center">
            No route data available for the current period.
          </div>
        ) : (
          routes.map((route, i) => (
            <div key={route.routeId} className="group cursor-pointer">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-primary/5 text-primary uppercase mb-1 inline-block">
                    {route.routeNumber}
                  </span>
                  <p className="text-xs font-bold text-primary truncate max-w-[180px]">{route.routeName}</p>
                </div>
                <div className="text-right">
                   <span className="text-xs font-black text-slate-900">{route.count}</span>
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Trips Today</p>
                </div>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-1000 group-hover:opacity-80" 
                  style={{ width: `${Math.min((route.count / 10) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>

      <Link 
        href={`/${locale}/analytics`}
        className="w-full mt-6 py-3 rounded-2xl bg-slate-50 text-slate-500 text-[10px] font-black hover:bg-slate-100 transition-colors uppercase tracking-widest text-center"
      >
        {t("view_all_analytics")}
      </Link>
    </div>
  );
}

