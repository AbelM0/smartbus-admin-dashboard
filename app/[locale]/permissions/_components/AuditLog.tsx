"use client";

interface AuditLogEntry {
  text: string;
  sub: string;
  time: string;
  type: string;
  color: string;
}

interface AuditLogProps {
  t: (key: string) => string;
  logs: AuditLogEntry[];
}

export function AuditLog({ t, logs }: AuditLogProps) {
  return (
    <div className="lg:col-span-12 bg-white rounded-xl shadow-[0_12px_40px_rgba(25,27,35,0.06)] p-5">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-0.5">
          <h3 className="text-xl font-black text-on-surface">{t("audit_log")}</h3>
          <p className="text-xs text-on-surface-variant">Real-time chronicle of system-level privilege alterations</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3.5 py-1.5 bg-surface-container rounded-full text-[10px] font-bold text-on-surface-variant cursor-pointer hover:bg-surface-container-highest transition-colors">Today</span>
          <span className="px-3.5 py-1.5 bg-transparent border border-outline-variant/30 rounded-full text-[10px] font-bold text-on-surface-variant cursor-pointer hover:bg-surface-container transition-colors">This Week</span>
        </div>
      </div>
      <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-surface-container">
        {logs.map((log, i) => (
          <div key={i} className="relative pl-9">
            <div className={`absolute left-0 top-1 w-5.5 h-5.5 rounded-full ${log.color} flex items-center justify-center ring-4 ring-white`}>
              <span className="material-symbols-outlined text-[13px] text-white">{log.type}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-1.5">
              <div>
                <p className="text-on-surface text-sm font-bold">{log.text}</p>
                <p className="text-[10px] text-on-surface-variant" dangerouslySetInnerHTML={{ __html: log.sub.replace('Alex Rivera', '<span class="text-primary font-bold">Alex Rivera</span>') }}></p>
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant tabular-nums">{log.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
