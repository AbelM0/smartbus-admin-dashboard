"use client";

interface Report {
  name: string;
  type: string;
  date: string;
  status: string;
  icon: string;
}

interface RecentReportsProps {
  t: (key: string) => string;
  reports: Report[];
}

export function RecentReports({ t, reports }: RecentReportsProps) {
  return (
    <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/5">
      <div className="p-4.5 border-b border-surface-container flex justify-between items-center">
        <h3 className="text-base font-bold text-on-surface">{t("recent_reports")}</h3>
        <button className="text-xs font-bold text-primary flex items-center gap-1">
          View Archive <span className="material-symbols-outlined text-xs">arrow_forward</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-[10px] uppercase tracking-widest text-on-surface-variant">
              <th className="px-4.5 py-3 font-bold">Report Name</th>
              <th className="px-4.5 py-3 font-bold">Type</th>
              <th className="px-4.5 py-3 font-bold">Generated Date</th>
              <th className="px-4.5 py-3 font-bold">Status</th>
              <th className="px-4.5 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {reports.map((report, i) => (
              <tr key={i} className="hover:bg-surface-container-low transition-colors group">
                <td className="px-4.5 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-primary text-lg">{report.icon}</span>
                    <span className="text-xs font-bold text-on-surface">{report.name}</span>
                  </div>
                </td>
                <td className="px-4.5 py-3 text-xs text-on-surface-variant">{report.type}</td>
                <td className="px-4.5 py-3 text-xs text-on-surface-variant">{report.date}</td>
                <td className="px-4.5 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    report.status === 'Completed' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-highest text-on-surface-variant'
                  }`}>{report.status}</span>
                </td>
                <td className="px-4.5 py-3 text-right">
                  <button className="p-1.5 rounded-lg hover:bg-white transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant text-base">
                      {report.status === 'Completed' ? 'download' : 'visibility'}
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
