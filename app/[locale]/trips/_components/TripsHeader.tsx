"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateTripDialog } from "./CreateTripDialog";

export function TripsHeader() {
  const t = useTranslations("trips");
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="flex-1">
        <span className="text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-1.5 block">
          {t("system_overview")}
        </span>
        <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">{t("title")}</h2>
        <p className="text-on-surface-variant mt-1.5 max-w-xl text-sm">{t("description")}</p>
      </div>

      <div className="flex items-center gap-4">


        <Button 
          onClick={() => setCreateOpen(true)}
          className="h-12 px-6 rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 font-bold transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          {t("schedule_trip")}
        </Button>
      </div>

      <CreateTripDialog open={createOpen} onOpenChange={setCreateOpen} />
    </section>
  );
}
