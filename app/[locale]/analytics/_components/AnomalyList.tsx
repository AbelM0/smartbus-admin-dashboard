"use client";

import { useGetAnomalies } from "@/hooks/analytics";
import { Loader2, ShieldAlert, AlertTriangle, CheckCircle2, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnomalyListProps {
  t: (key: string) => string;
}

export function AnomalyList({ t }: AnomalyListProps) {
  const { data: response, isLoading } = useGetAnomalies();
  
  const anomalies = response?.data?.items ?? [];
  const total = response?.data?.meta?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-xl",
            total > 0 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
          )}>
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-on-surface">{t("security_anomalies")}</h2>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
              {t("anomalies_desc")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t("total_flags")}</span>
          <span className={cn(
            "text-sm font-black",
            total > 0 ? "text-red-600" : "text-emerald-600"
          )}>{total}</span>
        </div>
      </div>

      <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("scanning_logs")}</p>
            </div>
          ) : anomalies.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-center px-6">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">{t("all_clear")}</h3>
                <p className="text-xs text-slate-500 max-w-[280px]">
                  {t("all_clear_desc")}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {anomalies.map((anomaly) => (
                <div key={anomaly.id} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                  <div className={cn(
                    "p-2 rounded-lg mt-0.5",
                    anomaly.severity === "CRITICAL" ? "bg-red-100 text-red-600" :
                    anomaly.severity === "HIGH" ? "bg-orange-100 text-orange-600" :
                    "bg-amber-100 text-amber-600"
                  )}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {anomaly.type.replace(/_/g, ' ')}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <History className="w-3 h-3" />
                        {new Date(anomaly.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{anomaly.description}</h4>
                    <div className="flex items-center gap-4 pt-1">
                      {anomaly.routeName && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                          <span className="text-[10px] font-bold text-slate-500">{anomaly.routeName}</span>
                        </div>
                      )}
                      {anomaly.driverName && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                          <span className="text-[10px] font-bold text-slate-500">{anomaly.driverName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
