"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useGetUser } from "@/hooks/users";
import { Loader2, UserCircle2, Mail, Phone, Shield, Calendar, Clock, Fingerprint } from "lucide-react";
import { ROLE_STYLES, STATUS_STYLES, formatRole, formatStatus } from "./UserDirectoryTable";

interface UserDetailSheetProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailSheet({ userId, open, onOpenChange }: UserDetailSheetProps) {
  const { data: response, isLoading, isError } = useGetUser(userId);
  const user = response?.data;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="border-b pb-4 mb-6">
          <SheetTitle>User Details</SheetTitle>
          <SheetDescription>
            Detailed information about the selected user account.
          </SheetDescription>
        </SheetHeader>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-slate-500">Fetching user details...</p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <UserCircle2 className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-sm text-slate-500 font-medium">Failed to load user details.</p>
            <p className="text-xs text-slate-400 mt-1">Please try again later or contact support.</p>
          </div>
        )}

        {user && (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl ring-4 ring-primary/5 mb-4">
                {user.fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{user.fullName}</h3>
              <div className="flex gap-2 mt-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${ROLE_STYLES[user.role] ?? "bg-slate-100 text-slate-600"}`}>
                  {formatRole(user.role)}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_STYLES[user.status] ?? "bg-slate-100 text-slate-500"}`}>
                  {formatStatus(user.status)}
                </span>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Contact Information</h4>
                <div className="bg-slate-50 rounded-xl p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 bg-white rounded-lg border border-slate-200">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</p>
                      <p className="text-sm font-semibold text-slate-700">{user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 bg-white rounded-lg border border-slate-200">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                      <p className="text-sm font-semibold text-slate-700">{user.email ?? "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Account Metadata</h4>
                <div className="bg-slate-50 rounded-xl p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 bg-white rounded-lg border border-slate-200">
                      <Fingerprint className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">FID</p>
                      <p className="text-sm font-mono font-semibold text-slate-700">{user.fid ?? "None"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 bg-white rounded-lg border border-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Joined Date</p>
                      <p className="text-sm font-semibold text-slate-700">
                        {new Date(user.createdAt).toLocaleDateString("en-US", { 
                          month: "long", 
                          day: "numeric", 
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 bg-white rounded-lg border border-slate-200">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Last Login</p>
                      <p className="text-sm font-semibold text-slate-700">
                        {user.lastLoginAt 
                          ? new Date(user.lastLoginAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })
                          : "Never logged in"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
