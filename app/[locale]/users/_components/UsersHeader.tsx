"use client";

interface UsersHeaderProps {
  t: (key: string) => string;
}

export function UsersHeader({ t }: UsersHeaderProps) {
  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-on-surface leading-none">{t("title")}</h2>
        <p className="mt-2 text-on-surface-variant max-w-2xl text-sm">{t("description")}</p>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-md flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-lg">person_add</span>
          {t("register")}
        </button>
      </div>
    </section>
  );
}
