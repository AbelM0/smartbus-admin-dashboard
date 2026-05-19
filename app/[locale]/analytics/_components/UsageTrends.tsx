"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetRevenueBreakdown } from "@/hooks/analytics";
import { Loader2, TrendingUp } from "lucide-react";

interface UsageTrendsProps {
  t: (key: string) => string;
}

export function UsageTrends({ t }: UsageTrendsProps) {
  const { data: revenueResponse, isLoading } = useGetRevenueBreakdown();
  
  const localChartConfig = {
    revenue: {
      label: t("net_revenue"),
      color: "var(--color-primary)",
    },
  } satisfies ChartConfig;

  const chartData = revenueResponse?.data?.byDay.map(item => ({
    date: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(item.date)),
    revenue: item.revenue
  })) ?? [];

  return (
    <section className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t("financial_performance")}</span>
          </div>
          <h3 className="text-lg font-black tracking-tight text-on-surface leading-none">{t("revenue_trends")}</h3>
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1.5">
            {t("revenue_trends_desc")}
          </p>
        </div>
      </div>

      
      <div className="h-80 w-full bg-surface-container-lowest rounded-xl p-4 relative flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t("loading_trends")}</p>
          </div>
        ) : chartData.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium italic">{t("no_revenue_data")}</p>
        ) : (
          <ChartContainer config={localChartConfig} className="h-full w-full">
            <AreaChart accessibilityLayer data={chartData}>
              <defs>
                <linearGradient id="revenue-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-[10px] font-bold fill-outline"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                className="text-[10px] font-bold fill-outline"
                tickFormatter={(value) => `${value.toLocaleString()}`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="revenue"
                type="natural"
                fill="url(#revenue-grad)"
                stroke="var(--color-primary)"
                strokeWidth={3}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </div>
    </section>
  );
}

