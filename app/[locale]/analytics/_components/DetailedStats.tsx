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

interface MetricItem {
  label: string;
  value: number;
  unit: string;
  icon?: React.ReactNode;
  highlight?: boolean;
  warning?: boolean;
}

export function DetailedStats({ t, data }: DetailedStatsProps) {
  if (!data) return null;

  const sections: {
    title: string;
    icon: React.ReactNode;
    metrics: MetricItem[];
  }[] = [
    {
      title: t("section_financial"),
      icon: <Receipt className="w-4 h-4 text-blue-600" />,
      metrics: [
        { label: t("label_gross_revenue"), value: data.totalRevenue, unit: t("unit_etb"), icon: <ArrowUpRight className="w-3 h-3 text-emerald-500" /> },
        { label: t("label_total_refunds"), value: data.totalRefunds, unit: t("unit_etb"), icon: <ArrowDownRight className="w-3 h-3 text-red-500" /> },
        { label: t("label_net_earnings"), value: data.netRevenue, unit: t("unit_etb"), highlight: true },
      ]
    },
    {
      title: t("section_lifecycle"),
      icon: <Ticket className="w-4 h-4 text-purple-600" />,
      metrics: [
        { label: t("label_used"), value: data.totalTicketsUsed, unit: t("unit_tickets"), icon: <History className="w-3 h-3 text-blue-500" /> },
        { label: t("label_expired"), value: data.totalTicketsExpired, unit: t("unit_tickets"), icon: <Clock className="w-3 h-3 text-amber-500" /> },
        { label: t("label_refunded"), value: data.totalTicketsRefunded, unit: t("unit_tickets"), icon: <Ban className="w-3 h-3 text-red-500" /> },
      ]
    },
    {
      title: t("section_operations"),
      icon: <Bus className="w-4 h-4 text-emerald-600" />,
      metrics: [
        { label: t("label_total_trips"), value: data.totalTrips, unit: t("unit_trips"), icon: <Bus className="w-3 h-3 text-emerald-500" /> },
        { label: t("label_system_scans"), value: data.totalScans, unit: t("unit_scans"), icon: <Scan className="w-3 h-3 text-blue-500" /> },
        { label: t("label_anomalies"), value: data.anomalyCount, unit: t("unit_alerts"), icon: <AlertTriangle className="w-3 h-3 text-red-500" />, warning: data.anomalyCount > 0 },
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
