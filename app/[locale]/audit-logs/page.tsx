import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { AuditLogTable } from "./_components/AuditLogTable";
import { History } from "lucide-react";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "audit_logs" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AuditLogsPage() {
  const t = await getTranslations("audit_logs");

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-primary">
          <History className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Security & Governance</span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">{t("title")}</h2>
        <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">{t("description")}</p>
      </section>

      <AuditLogTable />
    </div>
  );

}
