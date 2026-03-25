"use client";

interface Permission {
  name: string;
  desc: string;
  roles: boolean[];
}

interface PermissionsMatrixProps {
  t: (key: string) => string;
  permissions: Permission[];
}

export function PermissionsMatrix({ t, permissions }: PermissionsMatrixProps) {
  return (
    <div className="lg:col-span-8 bg-surface-container-low rounded-xl p-5 relative overflow-hidden">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">rule</span>
          {t("matrix")}
        </h3>
        <div className="flex gap-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
          <span className="w-20 text-center">{t("super_admin")}</span>
          <span className="w-20 text-center">{t("admin")}</span>
          <span className="w-20 text-center">{t("support")}</span>
        </div>
      </div>
      <div className="space-y-3">
        {permissions.map((perm, i) => (
          <div key={i} className="flex items-center justify-between p-3.5 bg-surface-container-lowest rounded-lg hover:bg-white transition-colors">
            <div className="flex flex-col">
              <span className="font-bold text-on-surface text-sm">{perm.name}</span>
              <span className="text-[10px] text-on-surface-variant leading-tight">{perm.desc}</span>
            </div>
            <div className="flex gap-3">
              {perm.roles.map((checked, j) => (
                <div key={j} className="w-20 flex justify-center">
                  <input
                    type="checkbox"
                    checked={checked}
                    readOnly
                    className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
}
