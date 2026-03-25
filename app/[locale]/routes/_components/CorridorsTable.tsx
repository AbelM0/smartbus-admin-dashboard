"use client";

interface Corridor {
  path: string;
  amharic: string;
  efficiency: number;
  driver: string;
  vehicleId: string;
  status: string;
}

interface CorridorsTableProps {
  t: (key: string) => string;
  corridors: Corridor[];
}

export function CorridorsTable({ t, corridors }: CorridorsTableProps) {
  return (
    <section className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/10">
      <div className="px-5 py-4 flex items-center justify-between border-b border-surface-container">
        <h3 className="text-base font-bold">{t("corridor_table")}</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-[10px] font-bold bg-surface-container rounded-lg hover:bg-surface-variant transition-colors">Export CSV</button>
          <button className="px-3 py-1.5 text-[10px] font-bold bg-primary text-white rounded-lg">{t("add_route")}</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low text-[10px] uppercase tracking-widest text-outline">
              <th className="px-5 py-3">{t("corridor_path")}</th>
              <th className="px-5 py-3">{t("route_pulse")}</th>
              <th className="px-5 py-3">{t("driver_assignment")}</th>
              <th className="px-5 py-3">{t("vehicle_id")}</th>
              <th className="px-5 py-3">{t("status")}</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {corridors.map((route, i) => (
              <tr key={i} className="hover:bg-surface-container-low transition-colors group">
                <td className="px-5 py-3">
                  <p className="font-bold text-xs">{route.path}</p>
                  <p className="amharic-text text-[10px] text-outline leading-tight">{route.amharic}</p>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div className={`h-full ${route.efficiency > 70 ? 'bg-primary' : 'bg-tertiary-container'}`} style={{ width: `${route.efficiency}%` }}></div>
                    </div>
                    <span className="text-[10px] font-bold">{route.efficiency}%</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-[9px] font-bold">
                      {route.driver.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-xs font-medium">{route.driver}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs font-mono text-outline">{route.vehicleId}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    route.status === 'Active' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-tertiary-fixed text-on-tertiary-fixed'
                  }`}>{route.status}</span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="p-1.5 hover:bg-surface-variant rounded-lg">
                    <span className="material-symbols-outlined text-base">more_vert</span>
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
