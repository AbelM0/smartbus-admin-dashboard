"use client";

interface LiveFleetTrackingProps {
  t: (key: string) => string;
}

export function LiveFleetTracking({ t }: LiveFleetTrackingProps) {
  return (
    <div className="lg:col-span-2 bg-[#e0e1eb] rounded-[24px] relative overflow-hidden group border-4 border-white shadow-xl min-h-[440px]">
      <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] opacity-20 grayscale brightness-50 mix-blend-overlay scale-150"></div>
      
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-white/50 z-10">
        <div className="flex items-center space-x-2 mb-1.5">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-primary uppercase tracking-tighter">{t("live_fleet_tracking")}</span>
        </div>
        <div className="space-y-0.5">
          <div className="flex justify-between text-[10px] font-medium text-outline space-x-6">
            <span>Bole (LRT)</span>
            <span className="text-primary font-bold">12 Buses</span>
          </div>
          <div className="flex justify-between text-[10px] font-medium text-outline">
            <span>Piazza / መሀል ከተማ</span>
            <span className="text-primary font-bold">08 Buses</span>
          </div>
          <div className="flex justify-between text-[10px] font-medium text-outline">
            <span>Megenagna</span>
            <span className="text-primary font-bold">15 Buses</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
         {/* Dynamic Bus Pin */}
         <div className="relative">
            <div className="absolute -top-12 -left-4 bg-white px-3 py-1 rounded-lg shadow-xl text-[10px] font-black pointer-events-none transform -translate-y-2 group-hover:translate-y-0 transition-transform whitespace-nowrap border border-primary/10">
               Bus #8842
               <div className="w-2 h-2 bg-white rotate-45 absolute -bottom-1 left-1/2 -ml-1 border-r border-b border-primary/10"></div>
            </div>
            <div className="w-4 h-4 bg-primary rounded-full ring-4 ring-primary/20 animate-bounce"></div>
         </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10">
        <button className="bg-primary text-white p-4 rounded-2xl shadow-2xl hover:bg-secondary active:scale-95 transition-all flex items-center space-x-2 font-bold text-sm">
          <span className="material-symbols-outlined">fullscreen</span>
          <span>{t("expand_map")}</span>
        </button>
      </div>
    </div>
  );
}
