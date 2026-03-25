"use client";

interface Commuter {
  id: string;
  name: string;
  email: string;
  type: string;
  balance: string;
  status: string;
  avatar: string;
}

interface UserDirectoryTableProps {
  t: (key: string) => string;
  commuters: Commuter[];
}

export function UserDirectoryTable({ t, commuters }: UserDirectoryTableProps) {
  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="bg-surface-container-low rounded-lg overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-outline-variant/10">
          <h3 className="font-bold text-base text-primary">{t("recent_registrations")}</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold uppercase tracking-tighter">Active</button>
            <button className="px-3 py-1.5 rounded-full bg-surface-variant text-on-surface-variant text-xs font-bold uppercase tracking-tighter">Blocked</button>
            <button className="px-3 py-1.5 rounded-full bg-surface-variant text-on-surface-variant text-xs font-bold uppercase tracking-tighter">Student</button>
            <button className="px-3 py-1.5 rounded-full bg-surface-variant text-on-surface-variant text-xs font-bold uppercase tracking-tighter">Elder</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider bg-surface-container/50">
                <th className="px-4 py-2.5">Commuter Profile</th>
                <th className="px-4 py-2.5">Card ID</th>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Balance</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {commuters.map((commuter) => (
                <tr key={commuter.id} className="hover:bg-surface-container-lowest transition-colors group">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        className="w-8 h-8 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all font-sans"
                        src={commuter.avatar}
                        alt={commuter.name}
                      />
                      <div>
                        <p className="font-bold text-on-surface text-xs leading-tight">{commuter.name}</p>
                        <p className="text-[10px] text-on-surface-variant">{commuter.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-secondary-container font-bold">{commuter.id}</td>
                  <td className="px-4 py-2.5">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      commuter.type === "Student" ? "bg-tertiary-fixed text-on-tertiary-fixed-variant" :
                      commuter.type === "Elder" ? "bg-surface-variant text-on-surface-variant" :
                      "bg-secondary-fixed text-on-secondary-fixed-variant"
                    }`}>{commuter.type}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-base font-bold text-on-secondary-container">{commuter.balance}</span>
                      <span className="text-[9px] text-on-surface-variant font-bold">ETB</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className={`flex items-center gap-1.5 ${
                      commuter.status === "Active" ? "text-primary" :
                      commuter.status === "Low Balance" ? "text-error" :
                      "text-on-surface-variant/40"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        commuter.status === "Active" ? "bg-primary animate-pulse" :
                        commuter.status === "Low Balance" ? "bg-error" :
                        "bg-on-surface-variant/40"
                      }`}></span>
                      <span className="text-[10px] font-bold">{commuter.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button className="text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-lg">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-surface-container/30 flex justify-between items-center text-sm font-medium text-on-surface-variant">
          <span>Showing 1-10 of 42,842 commuters</span>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
