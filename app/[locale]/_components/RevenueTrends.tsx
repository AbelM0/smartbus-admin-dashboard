"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface RevenueTrendsProps {
  t: (key: string) => string;
}

const chartData = [
  { month: "M1", revenue: 40 },
  { month: "M2", revenue: 60 },
  { month: "M3", revenue: 45 },
  { month: "M4", revenue: 75 },
  { month: "M5", revenue: 90 },
  { month: "M6", revenue: 65 },
  { month: "M7", revenue: 80 },
  { month: "M8", revenue: 55 },
  { month: "M9", revenue: 70 },
  { month: "M10", revenue: 85 },
  { month: "M11", revenue: 95 },
  { month: "M12", revenue: 100 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

export function RevenueTrends({ t }: RevenueTrendsProps) {
  return (
    <div className="bg-surface-container-low rounded-[24px] p-6 border border-white/40 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h4 className="font-black text-primary text-lg tracking-tight">{t("revenue_trends")}</h4>
          <p className="text-outline text-[10px] font-medium uppercase tracking-widest mt-1">Ethiopian Calendar (E.C.) Financials</p>
        </div>
        <div className="flex bg-surface-container-highest p-1 rounded-lg">
          <button className="px-3 py-1.5 rounded-md bg-primary text-white text-[9px] font-black">2016 E.C.</button>
          <button className="px-3 py-1.5 rounded-md text-outline text-[9px] font-black">2015 E.C.</button>
        </div>
      </div>
      
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value}
            className="font-bold text-[10px]"
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar
            dataKey="revenue"
            fill="var(--color-primary)"
            radius={6}
            className="opacity-20 hover:opacity-100 transition-opacity cursor-pointer"
          />
        </BarChart>
      </ChartContainer>

      <div className="mt-4 pt-4 border-t border-outline-variant/10 flex justify-between items-center">
         <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Target Met</span>
         </div>
         <span className="text-sm font-black text-primary leading-none">ETB 2.4M Peak</span>
      </div>
    </div>
  );
}
