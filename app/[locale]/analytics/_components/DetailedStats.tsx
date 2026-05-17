"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AnalyticsData } from "@/types/api/analytics";
import { 
  Receipt, 
  Ticket, 
  Bus, 
  Scan, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  History,
  Ban
} from "lucide-react";

interface DetailedStatsProps {
  t: (key: string) => string;
  data?: AnalyticsData;
}

export function DetailedStats({ t, data }: DetailedStatsProps) {
  if (!data) return null;

  const sections = [
    {
      title: "Financial Breakdown",
      icon: <Receipt className="w-4 h-4 text-blue-600" />,
      metrics: [
        { label: "Gross Revenue", value: data.totalRevenue, unit: "ETB", icon: <ArrowUpRight className="w-3 h-3 text-emerald-500" /> },
        { label: "Total Refunds", value: data.totalRefunds, unit: "ETB", icon: <ArrowDownRight className="w-3 h-3 text-red-500" /> },
        { label: "Net Earnings", value: data.netRevenue, unit: "ETB", highlight: true },
      ]
    },
    {
      title: "Ticket Lifecycle",
      icon: <Ticket className="w-4 h-4 text-purple-600" />,
      metrics: [
        { label: "Used", value: data.totalTicketsUsed, unit: "Tickets", icon: <History className="w-3 h-3 text-blue-500" /> },
        { label: "Expired", value: data.totalTicketsExpired, unit: "Tickets", icon: <Clock className="w-3 h-3 text-amber-500" /> },
        { label: "Refunded", value: data.totalTicketsRefunded, unit: "Tickets", icon: <Ban className="w-3 h-3 text-red-500" /> },
      ]
    },
    {
      title: "Operations & Security",
      icon: <Bus className="w-4 h-4 text-emerald-600" />,
      metrics: [
        { label: "Total Trips", value: data.totalTrips, unit: "Trips", icon: <Bus className="w-3 h-3 text-emerald-500" /> },
        { label: "System Scans", value: data.totalScans, unit: "Scans", icon: <Scan className="w-3 h-3 text-blue-500" /> },
        { label: "Anomalies", value: data.anomalyCount, unit: "Alerts", icon: <AlertTriangle className="w-3 h-3 text-red-500" />, warning: data.anomalyCount > 0 },
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {sections.map((section, idx) => (
        <Card key={idx} className="bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2">
            {section.icon}
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{section.title}</h3>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {section.metrics.map((metric, midx) => (
                <div key={midx} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                  <div className="flex items-center gap-2">
                    {metric.icon}
                    <span className="text-[11px] font-medium text-slate-500">{metric.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-sm font-black tracking-tight ${metric.highlight ? 'text-primary' : metric.warning ? 'text-red-600' : 'text-slate-900'}`}>
                      {metric.value.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{metric.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
