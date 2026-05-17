"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { 
  Loader2, 
  Search, 
  History,
  ChevronLeft,
  ChevronRight,
  Info,
  Eye,
  User,
  Activity,
  Globe,
  Clock
} from "lucide-react";
import { useGetAuditLogs } from "@/hooks/audit";
import { AuditLog } from "@/types/api/audit";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

export function AuditLogTable() {
  const t = useTranslations("audit_logs");
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data, isLoading, isError } = useGetAuditLogs({
    page,
    limit: 15,
  });

  const logs = data?.data?.items ?? [];
  const meta = data?.data?.meta;

  const getActionColor = (action: string) => {
    if (action.includes("create")) return "bg-emerald-100 text-emerald-700";
    if (action.includes("update")) return "bg-blue-100 text-blue-700";
    if (action.includes("delete")) return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm">
      <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">{t("title")}</h3>
        {meta && (
          <p className="text-[10px] text-slate-400">
            Total actions: {meta.total}
          </p>
        )}
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-3">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <p className="text-xs text-slate-400">Loading audit records...</p>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-64 text-red-500">
            <p className="text-sm font-medium">Failed to load audit logs.</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 space-y-2">
            <History className="w-8 h-8 text-slate-200" />
            <p className="text-sm font-medium">{t("no_logs")}</p>
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] uppercase bg-slate-50/50 text-slate-500 border-b border-slate-100 tracking-wider font-bold">
              <tr>
                <th className="px-4 py-3">{t("table_actor")}</th>
                <th className="px-4 py-3">{t("table_action")}</th>
                <th className="px-4 py-3">{t("table_target")}</th>
                <th className="px-4 py-3">{t("table_ip")}</th>
                <th className="px-4 py-3">{t("table_date")}</th>
                <th className="px-4 py-3 text-right">{t("table_details")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-[11px] leading-tight">{log.actor.fullName}</span>
                        <span className="text-[9px] text-slate-400 font-medium uppercase tracking-tight">{log.actor.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-tight ${getActionColor(log.action)}`}>
                      {log.action.replace(".", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[11px]">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{log.targetType}</span>
                      <span className="text-[9px] text-slate-400 font-mono">ID: {log.targetId.split("-")[0]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <Globe className="w-3 h-3 opacity-50" />
                      {log.ipAddress}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col text-[11px]">
                      <span className="text-slate-700 font-medium">
                        {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(log.createdAt))}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date(log.createdAt))}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button 
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <p className="text-[10px] text-slate-500 font-medium">
            Page {meta.page} of {meta.totalPages}
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Action Details
            </DialogTitle>
            <DialogDescription>
              Technical details for action {selectedLog?.action} on {selectedLog?.targetType}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto py-4 space-y-6">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Actor</p>
                <p className="text-slate-900 font-bold">{selectedLog?.actor.fullName}</p>
                <p className="text-slate-500">{selectedLog?.actor.role}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Timestamp</p>
                <p className="text-slate-900 font-bold">
                  {selectedLog && new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(selectedLog.createdAt))}
                </p>
                <p className="text-slate-500">
                  {selectedLog && new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date(selectedLog.createdAt))}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase font-bold text-slate-400 px-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    State Before
                  </p>
                  <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-[10px] overflow-auto max-h-[300px] font-mono leading-relaxed border border-slate-800">
                    {selectedLog?.beforeState 
                      ? JSON.stringify(selectedLog.beforeState, null, 2) 
                      : "// No previous state"}
                  </pre>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase font-bold text-blue-400 px-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    State After
                  </p>
                  <pre className="bg-slate-900 text-blue-50 p-4 rounded-xl text-[10px] overflow-auto max-h-[300px] font-mono leading-relaxed border border-blue-900/30 shadow-inner shadow-blue-900/20">
                    {selectedLog?.afterState 
                      ? JSON.stringify(selectedLog.afterState, null, 2) 
                      : "// No resulting state"}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
