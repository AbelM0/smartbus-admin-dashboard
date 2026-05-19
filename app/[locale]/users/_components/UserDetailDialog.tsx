"use client";

import { useState, useEffect } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetUser, useUpdateUser, useDisableUser, useEnableUser } from "@/hooks/users";
import { Loader2, UserCircle2, Mail, Phone, Calendar, Clock, Fingerprint, Edit2, X, Save, MoreVertical, Ban, UserCheck } from "lucide-react";
import { ROLE_STYLES, STATUS_STYLES, formatRole, formatStatus } from "./UserDirectoryTable";
import { UpdateUserPayload } from "@/types/api/users";

interface UserDetailDialogProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailDialog({ userId, open, onOpenChange }: UserDetailDialogProps) {
  const t = useTranslations("users");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UpdateUserPayload>({});

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "PASSENGER": return t("role_passenger") || "Passenger";
      case "DRIVER": return t("role_driver") || "Driver";
      case "ADMIN": return t("role_admin") || "Admin";
      case "SUPER_ADMIN": return t("role_super_admin") || "Super Admin";
      default: return formatRole(role);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE": return t("status_active") || "Active";
      case "DISABLED": return t("status_disabled") || "Disabled";
      case "PENDING_VERIFICATION": return t("status_pending") || "Pending Verification";
      default: return formatStatus(status);
    }
  };

  const { data: response, isLoading, isError } = useGetUser(userId);
  const user = response?.data;

  const { mutate: update, isPending: isUpdating } = useUpdateUser(userId || "", () => {
    setIsEditing(false);
  });

  const { mutate: disable, isPending: isDisabling } = useDisableUser();
  const { mutate: enable, isPending: isEnabling } = useEnableUser();

  useEffect(() => {
    if (user && isEditing) {
      setEditForm({
        fullName: user.fullName,
        email: user.email || "",
        phone: user.phone,
      });
    }
  }, [user, isEditing]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    update(editForm);
  };

  const handleClose = () => {
    setIsEditing(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg overflow-y-auto max-h-[90vh]">
        <DialogHeader className="border-b pb-4 mb-6 text-left flex flex-row items-center justify-between space-y-0 pr-8">
          <div>
            <DialogTitle className="text-xl">
              {isEditing ? (t("detail_edit_title") || "Edit User Profile") : (t("detail_title") || "User Account Details")}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? (t("detail_edit_desc") || "Modify the user's personal information.") : (t("detail_desc") || "Comprehensive overview of the user's profile.")}
            </DialogDescription>
          </div>
          {!isLoading && user && !isEditing && (
            <div className="flex items-center gap-2">
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="gap-2 cursor-pointer h-9 px-4 bg-primary text-white hover:bg-primary/90 shadow-sm transition-all active:scale-95"
              >
                <Edit2 className="w-3.5 h-3.5" />
                {t("detail_btn_edit") || "Edit Profile"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg border border-slate-200">
                    <MoreVertical className="w-4 h-4 text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {user.status === "DISABLED" ? (
                    <DropdownMenuItem 
                      className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50 gap-2 cursor-pointer"
                      disabled={isEnabling}
                      onClick={() => enable(user.id)}
                    >
                      {isEnabling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5 !text-emerald-600" />}
                      {t("action_enable") || "Enable Account"}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 gap-2 cursor-pointer"
                      disabled={isDisabling}
                      onClick={() => disable(user.id)}
                    >
                      {isDisabling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5 !text-red-600" />}
                      {t("action_disable") || "Disable Account"}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </DialogHeader>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-slate-500">{t("loading_details") || "Fetching user details..."}</p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <UserCircle2 className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-sm text-slate-500 font-medium">{t("failed_load_details") || "Failed to load user details."}</p>
            <p className="text-xs text-slate-400 mt-1">{t("failed_load_details_try_again") || "Please try again later."}</p>
          </div>
        )}

        {user && (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl ring-1 ring-primary/20 shrink-0">
                {user.fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-2xl font-bold text-slate-900 leading-tight">{user.fullName}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${ROLE_STYLES[user.role] ?? "bg-slate-100 text-slate-600"}`}>
                    {getRoleLabel(user.role)}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[user.status] ?? "bg-slate-100 text-slate-500"}`}>
                    {getStatusLabel(user.status)}
                  </span>
                </div>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-fullName">{t("create_label_fullname") || "Full Name"}</Label>
                    <Input 
                      id="edit-fullName"
                      value={editForm.fullName}
                      onChange={e => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-phone">{t("create_label_phone") || "Phone Number"}</Label>
                    <Input 
                      id="edit-phone"
                      value={editForm.phone}
                      onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-email">{t("create_label_email") || "Email Address"}</Label>
                    <Input 
                      id="edit-email"
                      type="email"
                      value={editForm.email}
                      onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <DialogFooter className="pt-4 border-t gap-2">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setIsEditing(false)}
                    disabled={isUpdating}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    {t("create_btn_cancel") || "Cancel"}
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isUpdating}
                    className="gap-2 bg-primary text-white hover:bg-primary/90"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {t("detail_btn_save") || "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">{t("detail_header_contact") || "Contact Info"}</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 group">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors">
                        <Phone className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">{t("detail_label_phone") || "Phone"}</p>
                        <p className="text-sm font-semibold text-slate-700 tracking-tight">{user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 group">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors">
                        <Mail className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">{t("detail_label_email") || "Email"}</p>
                        <p className="text-sm font-semibold text-slate-700 break-all">{user.email ?? "—"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">{t("detail_header_system") || "System Info"}</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 group">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors">
                        <Fingerprint className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">{t("detail_label_fid") || "FID"}</p>
                        <p className="text-sm font-mono font-semibold text-slate-700 uppercase tracking-tighter">{user.fid ?? "None"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 group">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors">
                        <Calendar className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">{t("detail_label_joined") || "Joined"}</p>
                        <p className="text-sm font-semibold text-slate-700">
                          {new Date(user.createdAt).toLocaleDateString("en-GB", { 
                            day: "2-digit",
                            month: "short", 
                            year: "numeric"
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isEditing && (
              <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{t("detail_label_last_active") || "Last Activity"}</span>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  {user.lastLoginAt 
                    ? new Date(user.lastLoginAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : (t("detail_last_activity_never") || "Never")}
                </span>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
