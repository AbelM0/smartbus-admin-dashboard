"use client";

import { useTranslations } from "next-intl";
import { PermissionsHeader } from "./_components/PermissionsHeader";
import { PermissionsMatrix } from "./_components/PermissionsMatrix";
import { AssignedAdmins } from "./_components/AssignedAdmins";
import { AuditLog } from "./_components/AuditLog";

const admins = [
  {
    name: "Alex Rivera",
    role: "Super Admin",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtGRZKTEFFTNI8mwcwG2Gxt6VB1Q1LMAtfcWuEq2TBvy6f91omgDYb86gmwGFSvMaJZRuD9Nb2BKAc0jR4rwd99Szr9_J22ntB_2Z5nKosQlHyf0mYL_b5110xPUaUdtv_USRVkDLOpr-EVq3pylVh68csE2zcmRF9qZTJDfpQHOXfqHdSESLEcWvdvu9MaGK-8py40FjSSCIxHbabKLG24tHgTQPEh8-GHnVisXJx53Yu7qDbpwyZj-v22fPk46cHy7VgWDgluzfq",
  },
  {
    name: "Sarah Jenkins",
    role: "Admin",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQh2OKs7zYR0WuB4enkhLqfbspaGzMYMdxb1DSH7BCV_BVO631tCPZwb--xvjcehc6ursvD0wDIHPNJmoUWQba45OEYzpdpRWPDeJy3-Ur-MIn6ugdcdwbEZM2amxjMTfzNxdMmQfyEIm6tZxjNxGEIS2Lkr4TE14LVp5TG1WEH7IHjWCco7OHWHhOFECjb4xoJRP0H54ZEkexGilhhUbfshqTmpXm8aU-X9Al6LOkMCXiEAgzj_y7ysA97rKlvLFsnA45t8JJRZDZ",
  },
  {
    name: "Marcus Thorne",
    role: "Support",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJIpB6wtDhR1EUntwy8xs59bBGip0FY2avw0kPbdnWWglpf2zxpeJc0nGjud_JB_mmsg0SQVANXsfJXBkrPjH9sCunAtRWpi3iCDLQzfvXbGAonsBNO0yhn_sPAdEXqcVpYFjra1qtcO0OJ_BltUc0kbYgCmYQO8U0XfnQ9jAn6NOJ6COUvYmdqxDc17JljTkTG7H3Ko_MaW5H5LCh9d0z7nz87-rvCDAP6Ot8td4wzXr1H3VkZj6KD9qF9j8P7LiiCWMJxUX3omTT",
  },
];

const permissions = [
  { name: "System Config", desc: "Global transit parameters and core API keys", roles: [true, false, false] },
  { name: "Route Editing", desc: "Modify bus lines, stops, and schedules", roles: [true, true, false] },
  { name: "Fleet Analytics", desc: "Access real-time usage and financial data", roles: [true, true, true] },
  { name: "User Auditing", desc: "View personnel activity and access history", roles: [true, false, false] },
];

const auditLogs = [
  { text: "Route Editing permission granted to 'Sarah Jenkins'", sub: "Modified by Alex Rivera • System Command", time: "14:22 ETB", type: "edit", color: "bg-primary" },
  { text: "Failed login attempt detected - Remote IP: 192.168.1.44", sub: "Security Flag • Access Denied", time: "12:05 ETB", type: "lock_open", color: "bg-tertiary" },
  { text: "New Support Role 'Transit Operator' initialized", sub: "Automated System Update • Policy v2.4", time: "09:30 ETB", type: "key", color: "bg-secondary" },
];

export default function RBACPage() {
  const t = useTranslations("permissions");

  return (
    <div className="p-5 space-y-6">
      <PermissionsHeader t={t} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <PermissionsMatrix t={t} permissions={permissions} />
        <AssignedAdmins t={t} admins={admins} />
        <AuditLog t={t} logs={auditLogs} />
      </div>
    </div>
  );
}
