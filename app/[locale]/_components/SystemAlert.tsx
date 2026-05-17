"use client";

import { useGetAnomalies } from "@/hooks/analytics";
import { Loader2, ShieldAlert, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface SystemAlertProps {
  t: (key: string) => string;
}

export function SystemAlert({ t }: SystemAlertProps) {
  const locale = useLocale();
  const { data: anomaliesResponse, isLoading } = useGetAnomalies({ limit: 1 });
  const latestAnomaly = anomaliesResponse?.data?.items[0];
  const totalAnomalies = anomaliesResponse?.data?.meta?.total ?? 0;

  return (
    <div className={cn(
      "rounded-[20px] p-4.5 text-white shadow-xl relative overflow-hidden group transition-all duration-500",
      totalAnomalies > 0 ? "bg-rose-600 shadow-rose-600/20" : "bg-primary shadow-primary/20"
    )}>
      <div className="absolute -right-4 -bottom-4 opacity-10 transform group-hover:scale-110 transition-transform">
         <ShieldAlert className="w-40 h-40" />
      </div>
      
      <div className="flex justify-between items-start mb-3 relative z-10">
        <h4 className="font-black tracking-tight text-sm uppercase tracking-widest flex items-center gap-2">
          {totalAnomalies > 0 ? <AlertCircle className="w-4 h-4 animate-pulse" /> : null}
          {totalAnomalies > 0 ? "System Security Alert" : t("system_alert")}
        </h4>
      </div>

      {isLoading ? (
        <div className="py-4 flex items-center gap-2 relative z-10">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Checking system health...</span>
        </div>
      ) : totalAnomalies > 0 ? (
        <>
          <p className="text-xs text-white/90 leading-relaxed mb-6 relative z-10 font-medium italic">
            "{latestAnomaly?.description || "Suspicious activity detected in system logs. Investigation recommended."}"
          </p>
          <Link 
            href={`/${locale}/analytics?tab=anomalies`}
            className="inline-block relative z-10 bg-white text-rose-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-sm hover:scale-[1.05] active:scale-[0.95] transition-all"
          >
            Investigate {totalAnomalies} Flag{totalAnomalies > 1 ? 's' : ''}
          </Link>
        </>
      ) : (
        <>
          <p className="text-xs text-secondary-fixed/80 leading-relaxed mb-6 relative z-10 font-medium">
            System health is optimal. No active anomalies or security flags detected in the current operational period.
          </p>
          <button className="relative z-10 bg-white text-primary text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-sm hover:scale-[1.05] active:scale-[0.95] transition-all">
            {t("manage_schedule")}
          </button>
        </>
      )}
    </div>
  );
}

