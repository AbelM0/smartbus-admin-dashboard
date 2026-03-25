"use client";

interface UsersStatsProps {
  t: (key: string) => string;
}

export function UsersStats({ t }: UsersStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-primary-container p-4 rounded-lg text-on-primary-container flex flex-col justify-between h-32">
        <span className="material-symbols-outlined text-2xl">group</span>
        <div>
          <p className="text-2xl font-bold leading-none -ml-1">42.8k</p>
          <p className="text-[10px] font-medium opacity-80 uppercase tracking-widest mt-1">{t("total_commuters")}</p>
        </div>
      </div>
      <div className="bg-surface-container p-4 rounded-lg flex flex-col justify-between h-32">
        <span className="material-symbols-outlined text-2xl text-primary">school</span>
        <div>
          <p className="text-xl font-bold text-on-surface">12,402</p>
          <p className="text-[10px] text-on-surface-variant font-medium mt-1">{t("student_accounts")}</p>
        </div>
      </div>
      <div className="bg-surface-container p-4 rounded-lg flex flex-col justify-between h-32">
        <span className="material-symbols-outlined text-2xl text-tertiary">elderly</span>
        <div>
          <p className="text-xl font-bold text-on-surface">3,150</p>
          <p className="text-[10px] text-on-surface-variant font-medium mt-1">{t("senior_citizens")}</p>
        </div>
      </div>
      <div className="bg-surface-container p-4 rounded-lg flex flex-col justify-between h-32">
        <span className="material-symbols-outlined text-2xl text-error">block</span>
        <div>
          <p className="text-xl font-bold text-on-surface">842</p>
          <p className="text-[10px] text-on-surface-variant font-medium mt-1">{t("blocked_status")}</p>
        </div>
      </div>
    </div>
  );
}
