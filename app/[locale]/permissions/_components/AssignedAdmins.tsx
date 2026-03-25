"use client";

interface Admin {
  name: string;
  role: string;
  avatar: string;
}

interface AssignedAdminsProps {
  t: (key: string) => string;
  admins: Admin[];
}

export function AssignedAdmins({ t, admins }: AssignedAdminsProps) {
  return (
    <div className="lg:col-span-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold">{t("assigned_admins")}</h3>
        <span className="text-[10px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded">12 Total</span>
      </div>
      <div className="space-y-3">
        {admins.map((admin, i) => (
          <div key={i} className="bg-surface-container p-3 rounded-lg flex items-center gap-3 hover:bg-surface-container-high transition-colors group cursor-pointer">
            <img src={admin.avatar} alt={admin.name} className="w-10 h-10 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-bold text-on-surface text-xs">{admin.name}</p>
              <span className={`text-[9px] font-black uppercase tracking-widest ${
                admin.role === 'Super Admin' ? 'text-primary' : 
                admin.role === 'Admin' ? 'text-secondary' : 'text-on-surface-variant'
              }`}>{admin.role}</span>
            </div>
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-lg">chevron_right</span>
          </div>
        ))}
      </div>
      <button className="w-full py-2 border border-dashed border-outline-variant text-on-surface-variant text-xs font-bold rounded-lg hover:bg-surface-container-low transition-colors">
        + {t("assign_member")}
      </button>
    </div>
  );
}
