"use client";

interface Hub {
  id: string;
  name: string;
  amharic: string;
  volume: string;
  icon: string;
}

interface LandmarksGridProps {
  t: (key: string) => string;
  hubs: Hub[];
}

export function LandmarksGrid({ t, hubs }: LandmarksGridProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{t("landmarks")}</h3>
        <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
          Manage Landmarks <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hubs.map((hub) => (
          <div key={hub.id} className="bg-surface-container-low p-4.5 rounded-xl group hover:bg-primary hover:text-white transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
              <span className="material-symbols-outlined text-primary group-hover:text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{hub.icon}</span>
              <span className="text-[9px] font-bold opacity-60">{hub.id}</span>
            </div>
            <h4 className="font-bold text-base mb-1">{hub.name}</h4>
            <p className="amharic-text text-[10px] opacity-70">{hub.amharic}</p>
            <div className="mt-3 pt-3 border-t border-outline-variant/20 flex justify-between items-end">
              <div>
                <p className="text-[9px] font-bold uppercase">Volume</p>
                <p className="text-lg font-black">{hub.volume} <span className="text-[10px] font-normal">/hr</span></p>
              </div>
              <span className="material-symbols-outlined text-lg opacity-0 group-hover:opacity-100 transition-opacity">north_east</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
