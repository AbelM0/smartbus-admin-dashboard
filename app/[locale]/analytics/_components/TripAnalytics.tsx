"use client";

import { useGetTripAnalytics } from "@/hooks/analytics";
import { Loader2, Bus, User, Navigation, BarChart2, ShieldCheck, Zap, Award } from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TripAnalyticsProps { t: (key: string) => string; }

const COLORS = {
  SCHEDULED: "#6366f1",    // indigo-500
  IN_PROGRESS: "#0ea5e9", // sky-500
  COMPLETED: "#10b981",   // emerald-500
  CANCELLED: "#f43f5e"    // red-500
};

export function TripAnalytics({ t }: TripAnalyticsProps) {
  const { data: response, isLoading } = useGetTripAnalytics();
  
  const statusData = response?.data?.byStatus ?? [];
  const routeData = response?.data?.byRoute ?? [];
  const driverData = response?.data?.byDriver ?? [];

  const totalTrips = statusData.reduce((acc, curr) => acc + curr.count, 0);

  const getTripStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case "SCHEDULED":
        return t("status_scheduled");
      case "IN_PROGRESS":
        return t("status_in_progress");
      case "COMPLETED":
        return t("status_completed");
      case "CANCELLED":
        return t("status_cancelled");
      default:
        return status.replace(/_/g, ' ');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simple Donut Chart */}
        <Card className="lg:col-span-5 bg-white border border-slate-200 shadow-sm group">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-2">
               <div className="p-1.5 bg-indigo-50 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Zap className="w-4 h-4" />
               </div>
               <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-800">{t("operational_pulse")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-80 relative">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="flex-1 relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-900">{totalTrips}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{t("trips_label_pie")}</span>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="status"
                        stroke="none"
                      >
                        {statusData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[entry.status as keyof typeof COLORS] || "#94a3b8"}
                            className="outline-none"
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ fontSize: '10px', borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pb-2">
                  {statusData.map((item) => (
                    <div key={item.status} className="flex items-center gap-1.5">
                      <div 
                        className="w-1.5 h-1.5 rounded-full" 
                        style={{ backgroundColor: COLORS[item.status as keyof typeof COLORS] || "#94a3b8" }}
                      />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        {getTripStatusLabel(item.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>



        {/* Operational Highlights */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
           <Card className="bg-white border border-slate-200 shadow-sm p-6 flex flex-col justify-between group relative overflow-hidden">
              <div className="space-y-4 relative z-10">
                 <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                       <Award className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">{t("top_tier")}</span>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{t("top_performer")}</p>
                    <h4 className="text-xl font-black text-slate-900">{driverData[0]?.driverName || t("not_available")}</h4>
                 </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-50 relative z-10 flex items-baseline gap-2">
                 <span className="text-2xl font-black text-slate-900 tracking-tighter">{driverData[0]?.count || 0}</span>
                 <span className="text-[9px] font-bold uppercase text-slate-400">{t("trips_completed")}</span>
              </div>
           </Card>

           <Card className="bg-white border border-slate-200 shadow-sm p-6 flex flex-col justify-between group relative overflow-hidden">
              <div className="space-y-4 relative z-10">
                 <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
                       <Navigation className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">{t("status_active")}</span>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{t("primary_corridor")}</p>
                    <h4 className="text-xl font-black text-slate-900">{routeData[0]?.routeNumber || t("not_available")}</h4>
                 </div>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-50 relative z-10 flex items-baseline gap-2">
                 <span className="text-2xl font-black text-slate-900 tracking-tighter">{routeData[0]?.count || 0}</span>
                 <span className="text-[9px] font-bold uppercase text-slate-400">{t("deployments")}</span>
              </div>
           </Card>

        </div>



        {/* Route Performance */}
        <Card className="lg:col-span-6 bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-indigo-600" />
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">{t("corridor_efficiency")}</h3>
            </div>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase text-slate-400 font-black bg-slate-50/30 border-b border-slate-100">
                    <th className="px-6 py-4">{t("table_route")}</th>
                    <th className="px-6 py-4 text-right">{t("trip_distribution")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr><td colSpan={2} className="py-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" /></td></tr>
                  ) : routeData.map((route) => (
                    <tr key={route.routeId} className="hover:bg-indigo-50/30 transition-all group cursor-pointer">
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {route.routeNumber}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{route.routeName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col items-end gap-2">
                           <span className="text-sm font-black text-slate-900">{route.count}</span>
                           <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-indigo-500 transition-all duration-1000" 
                                style={{ width: `${Math.min((route.count / 10) * 100, 100)}%` }}
                              ></div>
                           </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Driver Performance */}
        <Card className="lg:col-span-6 bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">{t("operator_performance")}</h3>
            </div>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase text-slate-400 font-black bg-slate-50/30 border-b border-slate-100">
                    <th className="px-6 py-4">{t("table_driver")}</th>
                    <th className="px-6 py-4 text-right">{t("table_metrics")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr><td colSpan={2} className="py-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-500" /></td></tr>
                  ) : driverData.map((driver) => (
                    <tr key={driver.driverId} className="hover:bg-emerald-50/30 transition-all group cursor-pointer">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-[10px]">
                              {driver.driverName.split(' ').map(n => n[0]).join('')}
                           </div>
                           <span className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                              {driver.driverName}
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                         <div className="flex flex-col items-end gap-1">
                            <span className="text-sm font-black text-slate-900">{driver.count}</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{t("trips_validated")}</span>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

