"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  FileSpreadsheet, 
  FileText as FilePdf, 
  Loader2, 
  FileStack,
  CheckCircle2
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { exportAnalyticsData } from "@/api/reports/reports";
import { ExportType, ExportFormat } from "@/types/api/reports";
import { toast } from "sonner";

interface ExportReportsSectionProps {
  t: (key: string) => string;
}

export function ExportReportsSection({ t }: ExportReportsSectionProps) {
  const [type, setType] = useState<ExportType>("revenue");
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await exportAnalyticsData({ type, format });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `smartbus_report_${type}_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report exported successfully!`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export report. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden mb-6">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <FileStack className="w-4 h-4 text-primary" />
          On-Demand Report Export
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Data Type</label>
            <Select value={type} onValueChange={(val) => setType(val as ExportType)}>
              <SelectTrigger className="bg-slate-50 border-slate-200 text-xs font-bold h-10">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue" className="text-xs">Revenue Breakdown</SelectItem>
                <SelectItem value="tickets" className="text-xs">Ticket Analytics</SelectItem>
                <SelectItem value="trips" className="text-xs">Fleet & Trip Logs</SelectItem>
                <SelectItem value="anomalies" className="text-xs">Security Anomalies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Format</label>
            <Select value={format} onValueChange={(val) => setFormat(val as ExportFormat)}>
              <SelectTrigger className="bg-slate-50 border-slate-200 text-xs font-bold h-10">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv" className="text-xs flex items-center gap-2">
                  <span className="flex items-center gap-2">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    Comma Separated (CSV)
                  </span>
                </SelectItem>
                <SelectItem value="pdf" className="text-xs flex items-center gap-2" disabled>
                  <span className="flex items-center gap-2">
                    <FilePdf className="w-3.5 h-3.5 text-red-600 opacity-50" />
                    PDF Document (v2)
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="h-10 px-8 font-black text-xs uppercase tracking-widest gap-2 bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            {isExporting ? "Generating..." : "Download Report"}
          </Button>
        </div>

        <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
            Your export will include all data filtered by the current global dashboard parameters (Route, Driver, and Date Range). 
            CSV files are optimized for Microsoft Excel and Google Sheets.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
