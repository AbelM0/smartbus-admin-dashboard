"use client";

import { useState } from "react";
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

const ROLES: { value: CreateUserPayload["role"]; label: string }[] = [
  { value: "PASSENGER", label: "Passenger" },
  { value: "DRIVER", label: "Driver" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

const EMPTY_FORM: CreateUserPayload = {
  fullName: "",
  phone: "",
  email: "",
  role: "PASSENGER",
  password: "",
  fid: "",
};

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const [form, setForm] = useState<CreateUserPayload>(EMPTY_FORM);

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
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Creates a user immediately with ACTIVE status — no OTP required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-fullName">Full Name <span className="text-red-500">*</span></Label>
            <Input
              id="cu-fullName"
              placeholder="e.g. Dawit Bekele"
              value={form.fullName}
              onChange={e => set("fullName", e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-phone">Phone <span className="text-red-500">*</span></Label>
            <Input
              id="cu-phone"
              type="tel"
              placeholder="+251911234567"
              value={form.phone}
              onChange={e => set("phone", e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-email">Email <span className="text-slate-400 text-xs">(optional)</span></Label>
            <Input
              id="cu-email"
              type="email"
              placeholder="user@example.com"
              value={form.email}
              onChange={e => set("email", e.target.value)}
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label>Role <span className="text-red-500">*</span></Label>
            <Select
              value={form.role}
              onValueChange={val => set("role", val)}
            >
              <SelectTrigger id="cu-role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map(r => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-password">Password <span className="text-red-500">*</span></Label>
            <Input
              id="cu-password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => set("password", e.target.value)}
              required
            />
          </div>

          {/* FID */}
          <div className="space-y-1.5">
            <Label htmlFor="cu-fid">FID <span className="text-slate-400 text-xs">(optional)</span></Label>
            <Input
              id="cu-fid"
              placeholder="e.g. ETH-DEMO-0001"
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
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="text-white bg-primary hover:bg-primary hover:text-white hover:bg-primary/90 cursor-pointer">
              {isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
              ) : (
                "Create User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
