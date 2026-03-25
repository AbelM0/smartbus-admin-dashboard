"use client";

interface PermissionsHeaderProps {
  t: (key: string) => string;
}

export function PermissionsHeader({ t }: PermissionsHeaderProps) {
  return (
    <section className="flex flex-col md:flex-row justify-between items-end gap-6">
      <div className="space-y-1">
        <span className="text-primary font-bold tracking-widest text-[10px] uppercase">{t("security_governance")}</span>
        <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">{t("title")}</h2>
        <p className="text-on-surface-variant max-w-xl text-sm leading-snug">{t("description")}</p>
      </div>
      <div className="flex gap-2.5">
        <button className="px-4 py-2 bg-surface-container-highest text-primary text-xs font-bold rounded-md hover:bg-surface-dim transition-all">
          {t("export_logs")}
        </button>
        <button className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-md hover:opacity-90 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-xs">add</span>
          {t("create_role")}
        </button>
      </div>
    </section>
  );
}
