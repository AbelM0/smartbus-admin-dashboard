"use client";

import { useTranslations } from "next-intl";
import { UsersHeader } from "./_components/UsersHeader";
import { UserDirectoryTable } from "./_components/UserDirectoryTable";

export default function UserManagement() {
  const t = useTranslations("users");

  return (
    <div className="space-y-6">

      <UsersHeader t={t} />
      <UserDirectoryTable />
    </div>
  );
}
