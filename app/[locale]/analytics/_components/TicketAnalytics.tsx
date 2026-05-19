"use client";

import { useGetTicketAnalytics } from "@/hooks/analytics";
import { Loader2, Ticket, PieChart as PieChartIcon, Bus, ArrowUpRight } from "lucide-react";
import { 
  Pie, 
  PieChart, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TicketAnalyticsProps { t: (key: string) => string; }

const COLORS = {
  USED: "#6366f1",     // indigo-500
  EXPIRED: "#f59e0b",  // amber-500
  REFUNDED: "#f43f5e", // rose-500
  PURCHASED: "#10b981" // emerald-500
};

export function TicketAnalytics({ t }: TicketAnalyticsProps) {
  const { data: response, isLoading } = useGetTicketAnalytics();
  
  const statusData = response?.data?.byStatus ?? [];
  const averageFare = response?.data?.averageFare ?? 0;
  const totalTickets = statusData.reduce((acc, curr) => acc + curr.count, 0);

  const getTicketStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case "USED":
        return t("ticket_status_used");
      case "EXPIRED":
        return t("ticket_status_expired");
      case "REFUNDED":
        return t("ticket_status_refunded");
      case "PURCHASED":
        return t("ticket_status_purchased");
      default:
        return status;
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.count / totalTickets) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 animate-in zoom-in-95 duration-200">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
            {getTicketStatusLabel(data.status)}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-slate-900">{data.count.toLocaleString()}</span>
            <span className="text-xs font-bold text-primary">{percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <Card className="lg:col-span-8 bg-white border border-slate-200 shadow-sm overflow-hidden group">
        <CardHeader className="pb-2 border-b border-slate-50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-slate-800">
                <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
                  <Ticket className="w-4 h-4" />
                </div>
                {t("ticket_lifecycle")}
              </CardTitle>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-7">
                {t("ticket_lifecycle_desc")}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900 tracking-tighter">{totalTickets.toLocaleString()}</span>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{t("total_processed")}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-80 pt-6 relative">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t("analyzing_batches")}</p>
            </div>
          ) : statusData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
              {t("no_ticket_data")}
            </div>
          ) : (
            <div className="flex h-full items-center">
              <div className="flex-1 h-full relative">
                 {/* Center Label */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t("status_active")}</span>
                    <span className="text-xl font-black text-slate-900 leading-none">{t("status_healthy")}</span>
                 </div>
                 <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="count"
                      nameKey="status"
                      stroke="none"
                    >
                      {statusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[entry.status as keyof typeof COLORS] || "#94a3b8"}
                          className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="w-48 space-y-4 pr-4">
                {statusData.map((item) => {
                  const percentage = ((item.count / totalTickets) * 100).toFixed(0);
                  return (
                    <div key={item.status} className="flex items-center justify-between group/item">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: COLORS[item.status as keyof typeof COLORS] || "#94a3b8" }}
                        />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover/item:text-slate-900 transition-colors">
                          {getTicketStatusLabel(item.status)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-slate-900">{percentage}%</div>
                        <div className="text-[8px] font-bold text-slate-400 uppercase">{item.count} {t("unit_pkts_lowercase")}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-4 bg-white border border-slate-200 shadow-sm overflow-hidden group">
        <CardContent className="p-8 h-full flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
                <PieChartIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <ArrowUpRight className="w-3 h-3" />
                {t("status_stable")}
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t("yield_per_ticket")}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tighter text-slate-900">
                  {isLoading ? "..." : averageFare.toLocaleString()}
                </span>
                <span className="text-sm font-black text-slate-400 uppercase">{t("unit_etb")}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{t("tax_component")}</p>
                  <p className="text-sm font-black text-slate-900">{t("unit_etb")} {(averageFare * 0.15).toFixed(0)}</p>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{t("service_portion")}</p>
                  <p className="text-sm font-black text-slate-900">{t("unit_etb")} {(averageFare * 0.05).toFixed(0)}</p>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              </div>
            </div>
          </div>
          
          <div className="pt-6 mt-4 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t("financial_yield_metric")}</p>
            <div className="flex items-center gap-1.5">
               <span className="text-[8px] font-black text-emerald-600 uppercase">{t("verified")}</span>
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>


      <Card className="lg:col-span-12 bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl border border-indigo-100">
              <Bus className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{t("route_transaction_volume")}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{t("corridor_analysis_desc")}</p>
            </div>
          </div>
          <button className="text-[10px] font-black text-primary uppercase tracking-widest px-4 py-2 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
            {t("analyze_corridors")}
          </button>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase text-slate-400 font-black bg-slate-50/30 border-b border-slate-100">
                  <th className="px-8 py-4">{t("table_status")}</th>
                  <th className="px-8 py-4">{t("corridor_number")}</th>
                  <th className="px-8 py-4">{t("designation")}</th>
                  <th className="px-8 py-4 text-right">{t("processed_volume")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center">
                      <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : response?.data?.byRoute.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-xs text-slate-400 italic">
                      {t("no_corridor_activity")}
                    </td>
                  </tr>
                ) : (
                  response?.data?.byRoute.map((route) => (
                    <tr key={route.routeId} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                      <td className="px-8 py-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm"></div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-xs font-black text-indigo-600 px-2.5 py-1.5 bg-indigo-50 rounded-xl border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {route.routeNumber}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <p className="text-xs font-bold text-slate-700 leading-none">{route.routeName}</p>
                        <p className="text-[9px] text-slate-400 font-medium uppercase tracking-widest mt-1.5">{t("metropolitan_corridor")}</p>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-sm font-black text-slate-900 tabular-nums">{route.count.toLocaleString()}</span>
                          <div className="h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: `${Math.min((route.count/5)*100, 100)}%` }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


