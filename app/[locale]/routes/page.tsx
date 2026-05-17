"use client";

import { useTranslations } from "next-intl";
import { RoutesHeader } from "./_components/RoutesHeader";
import { RouteDirectoryTable } from "./_components/RouteDirectoryTable";

export default function RouteManagement() {
  const t = useTranslations("routes");

  return (
    <div className="space-y-6">

      <RoutesHeader t={t} />
      <RouteDirectoryTable />
    </div>
  );
}
