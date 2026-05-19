"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetRevenueBreakdown } from "@/hooks/analytics";
import { Loader2, TrendingUp, Download } from "lucide-react";

import { exportAnalyticsData } from "@/api/reports/reports";
import { toast } from "sonner";
import { useState } from "react";
import { useLocale } from "next-intl";

interface RevenueTrendsProps {
  t: (key: string) => string;
}


export function RevenueTrends({ t }: RevenueTrendsProps) {
  const locale = useLocale();
  const { data: revenueResponse, isLoading } = useGetRevenueBreakdown();
  const [isExporting, setIsExporting] = useState(false);

  const chartConfig = {
    revenue: {
      label: t("revenue"),
      color: "#6366f1",
    },
  } satisfies ChartConfig;
  
  const chartData = revenueResponse?.data?.byDay.map(item => ({
    date: new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(new Date(item.date)),
    revenue: item.revenue
  })) ?? [];

  const totalRevenue = revenueResponse?.data?.total ?? 0;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await exportAnalyticsData({ type: "revenue", format: "csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `smartbus_revenue_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(t("export_success"));
    } catch (error) {
      toast.error(t("export_failed"));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm min-h-[450px] flex flex-col group">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1.5">
            <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h4 className="font-black text-sm uppercase tracking-[0.2em]">{t("revenue_trends")}</h4>
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">{t("revenue_subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-black shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            2016 E.C.
          </div>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-[10px] font-black shadow-sm hover:border-primary hover:text-primary transition-all disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
            {t("export_csv")}
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t("generating_insight")}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-slate-400 font-medium italic">{t("no_revenue_activity")}</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.05} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={15}
                axisLine={false}
                className="font-bold text-[10px] fill-slate-400"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                className="font-bold text-[10px] fill-slate-400"
                tickFormatter={(val) => `ETB ${val.toLocaleString()}`}
                width={80}
              />
              <ChartTooltip
                cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '4 4' }}
                content={<ChartTooltipContent hideLabel />}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                animationDuration={1500}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
         <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 border-2 border-white"></div>
              <div className="w-6 h-6 rounded-full bg-primary/40 border-2 border-white"></div>
              <div className="w-6 h-6 rounded-full bg-primary/60 border-2 border-white"></div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t("peak_activity")}</span>
         </div>
         <div className="text-right">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t("total_period_revenue")}</p>
           <span className="text-2xl font-black text-slate-900 tracking-tighter">
             ETB {totalRevenue.toLocaleString()}
           </span>
         </div>
      </div>
    </div>
  );
}


