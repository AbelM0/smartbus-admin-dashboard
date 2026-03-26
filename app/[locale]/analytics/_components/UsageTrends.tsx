"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface UsageTrendsProps {
  t: (key: string) => string;
}

const chartData = [
  { hour: "06:00", value: 400 },
  { hour: "08:00", value: 1200 },
  { hour: "10:00", value: 800 },
  { hour: "12:00", value: 1600 },
  { hour: "14:00", value: 2480 },
  { hour: "16:00", value: 1900 },
  { hour: "18:00", value: 2100 },
  { hour: "20:00", value: 1200 },
  { hour: "22:00", value: 600 },
];

const chartConfig = {
  value: {
    label: "Usage",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

export function UsageTrends({ t }: UsageTrendsProps) {
  return (
    <section className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
        <div>
          <h3 className="text-lg font-black tracking-tight text-on-surface leading-none">{t("usage_trends")}</h3>
          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1.5">Hourly daily volume for all active zones</p>
        </div>
        <div className="flex bg-surface-container-highest p-1 rounded-lg">
          <button className="px-3 py-1 text-[10px] font-bold rounded-md bg-white text-primary shadow-sm">Hourly</button>
          <button className="px-3 py-1 text-[10px] font-bold rounded-md text-on-surface-variant">Daily</button>
          <button className="px-3 py-1 text-[10px] font-bold rounded-md text-on-surface-variant">Weekly</button>
        </div>
      </div>
      
      <ChartContainer config={chartConfig} className="h-80 w-full bg-surface-container-lowest rounded-xl p-4">
        <AreaChart accessibilityLayer data={chartData}>
          <defs>
            <linearGradient id="usage-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis
            dataKey="hour"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            className="text-[10px] font-bold fill-outline"
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Area
            dataKey="value"
            type="natural"
            fill="url(#usage-grad)"
            stroke="var(--color-primary)"
            strokeWidth={3}
          />
        </AreaChart>
      </ChartContainer>
    </section>
  );
}
