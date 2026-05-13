"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Navigation } from "lucide-react";
import { CreateRouteDialog } from "./CreateRouteDialog";

interface RoutesHeaderProps {
  t: (key: string) => string;
}

export function RoutesHeader({ t }: RoutesHeaderProps) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="flex-1">
        <span className="text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-1.5 block">{t("system_overview")}</span>
        <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">{t("title")}</h2>
        <p className="text-on-surface-variant mt-1.5 max-w-xl text-sm">{t("description")}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex gap-3">
          <div className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{t("active_buses")}</p>
            <p className="text-xl font-black text-primary tracking-tighter leading-none">142</p>
          </div>
          <div className="px-4 py-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl">
            <p className="text-[10px] font-bold opacity-70 uppercase leading-none mb-1">{t("daily_efficiency")}</p>
            <p className="text-xl font-black tracking-tighter leading-none">98.4%</p>
          </div>
        </div>

        <Button 
          onClick={() => setCreateOpen(true)}
          className="h-12 px-6 rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 font-bold transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create Route
        </Button>
      </div>

      <CreateRouteDialog open={createOpen} onOpenChange={setCreateOpen} />
    </section>
  );
}
