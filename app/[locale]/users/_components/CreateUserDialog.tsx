"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateUser } from "@/hooks/users";
import { CreateUserPayload } from "@/types/api/users";
import { Loader2 } from "lucide-react";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}



const EMPTY_FORM: CreateUserPayload = {
  fullName: "",
  phone: "",
  email: "",
  role: "PASSENGER",
  password: "",
  fid: "",
};

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const t = useTranslations("users");
  const [form, setForm] = useState<CreateUserPayload>(EMPTY_FORM);

  const rolesList: { value: CreateUserPayload["role"]; label: string }[] = [
    { value: "PASSENGER", label: t("role_passenger") || "Passenger" },
    { value: "DRIVER", label: t("role_driver") || "Driver" },
    { value: "ADMIN", label: t("role_admin") || "Admin" },
    { value: "SUPER_ADMIN", label: t("role_super_admin") || "Super Admin" },
  ];

  const { mutate: create, isPending } = useCreateUser(() => {
    onOpenChange(false);
    setForm(EMPTY_FORM);
  });

  const set = (key: keyof CreateUserPayload, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateUserPayload = {
      fullName: form.fullName,
      phone: form.phone,
      role: form.role,
      password: form.password,
      ...(form.email ? { email: form.email } : {}),
      ...(form.fid ? { fid: form.fid } : {}),
    };
    create(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("create_title") || "Add New User"}</DialogTitle>
          <DialogDescription>
            {t("create_description") || "Creates a user immediately with ACTIVE status — no OTP required."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-fullName">{t("create_label_fullname") || "Full Name"} <span className="text-red-500">*</span></Label>
            <Input
              id="cu-fullName"
              placeholder={t("create_placeholder_fullname") || "e.g. Dawit Bekele"}
              value={form.fullName}
              onChange={e => set("fullName", e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-phone">{t("create_label_phone") || "Phone"} <span className="text-red-500">*</span></Label>
            <Input
              id="cu-phone"
              type="tel"
              placeholder={t("create_placeholder_phone") || "+251911234567"}
              value={form.phone}
              onChange={e => set("phone", e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-email">{t("create_label_email") || "Email"} <span className="text-slate-400 text-xs">({t("optional") || "optional"})</span></Label>
            <Input
              id="cu-email"
              type="email"
              placeholder={t("create_placeholder_email") || "user@example.com"}
              value={form.email}
              onChange={e => set("email", e.target.value)}
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label>{t("create_label_role") || "Role"} <span className="text-red-500">*</span></Label>
            <Select
              value={form.role}
              onValueChange={val => set("role", val)}
            >
              <SelectTrigger id="cu-role">
                <SelectValue placeholder={t("create_placeholder_role") || "Select role"} />
              </SelectTrigger>
              <SelectContent>
                {rolesList.map(r => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-password">{t("create_label_password") || "Password"} <span className="text-red-500">*</span></Label>
            <Input
              id="cu-password"
              type="password"
              placeholder={t("create_placeholder_password") || "••••••••"}
              value={form.password}
              onChange={e => set("password", e.target.value)}
              required
            />
          </div>

          {/* FID */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-fid">{t("create_label_fid") || "FID"} <span className="text-slate-400 text-xs">({t("optional") || "optional"})</span></Label>
            <Input
              id="cu-fid"
              placeholder={t("create_placeholder_fid") || "e.g. ETH-DEMO-0001"}
              value={form.fid}
              onChange={e => set("fid", e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="cursor-pointer"
            >
              {t("create_btn_cancel") || "Cancel"}
            </Button>
            <Button type="submit" disabled={isPending} className="text-white bg-primary hover:bg-primary hover:text-white hover:bg-primary/90 cursor-pointer">
              {isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("create_btn_creating") || "Creating..."}</>
              ) : (
                t("create_btn_submit") || "Create User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
