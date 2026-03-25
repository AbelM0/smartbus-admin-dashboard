"use client";

import { useTranslations } from "next-intl";
import { RoutesHeader } from "./_components/RoutesHeader";
import { NetworkCoverage } from "./_components/NetworkCoverage";
import { TrafficInsights } from "./_components/TrafficInsights";
import { CorridorsTable } from "./_components/CorridorsTable";
import { LandmarksGrid } from "./_components/LandmarksGrid";
import { AddRouteFAB } from "./_components/AddRouteFAB";

const corridors = [
  {
    path: "Piazza → Arat Kilo",
    amharic: "ፒያሳ → አራት ኪሎ",
    efficiency: 92,
    driver: "Hiwot Bekele",
    vehicleId: "ANB-4421",
    status: "Active",
  },
  {
    path: "Bole → CMC",
    amharic: "ቦሌ → ሲ ኤም ሲ",
    efficiency: 45,
    driver: "Tewodros Assefa",
    vehicleId: "ANB-9022",
    status: "Maintenance",
  },
  {
    path: "Megenagna → Mexico",
    amharic: "መገናኛ → ሜክሲኮ",
    efficiency: 78,
    driver: "Sara Mohammed",
    vehicleId: "ANB-1182",
    status: "Active",
  },
];

const hubs = [
  { name: "Megenagna", amharic: "መገናኛ", id: "HUB 01", volume: "4.2k", icon: "hub" },
  { name: "Bole Medhanialem", amharic: "ቦሌ መድኃኔዓለም", id: "HUB 02", volume: "2.8k", icon: "location_city" },
  { name: "Mexico Square", amharic: "ሜክሲኮ አደባባይ", id: "HUB 03", volume: "5.1k", icon: "account_balance" },
  { name: "Meskel Square", amharic: "መስቀል አደባባይ", id: "HUB 04", volume: "8.4k", icon: "stadium" },
];

export default function RouteManagement() {
  const t = useTranslations("routes");

  return (
    <div className="p-5 space-y-6">
      <RoutesHeader t={t} />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NetworkCoverage t={t} />
        <TrafficInsights t={t} />
      </section>

      <CorridorsTable t={t} corridors={corridors} />
      <LandmarksGrid t={t} hubs={hubs} />
      
      <AddRouteFAB />
    </div>
  );
}
