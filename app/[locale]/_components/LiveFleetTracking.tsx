"use client";

import { useState, useEffect } from "react";

interface LiveFleetTrackingProps {
  t: (key: string) => string;
}

export function LiveFleetTracking({ t }: LiveFleetTrackingProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Prevent scrolling when map is expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isExpanded]);

  const mapUrl = "https://maps.google.com/maps?q=Addis%20Ababa&t=k&z=13&ie=UTF8&iwloc=&output=embed";

  return (
    <>
      <div className="lg:col-span-2 bg-[#e0e1eb] rounded-[24px] relative overflow-hidden group border-4 border-white shadow-xl min-h-[440px]">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 grayscale opacity-90 contrast-125 brightness-110 transition-all group-hover:grayscale-0 group-hover:opacity-100"
        ></iframe>
        <div className="absolute inset-0 bg-primary/5 pointer-events-none mix-blend-multiply group-hover:bg-transparent transition-colors"></div>
        
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-white/50 z-10 transition-transform group-hover:scale-105 origin-top-left">
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
          </div>
        </div>



        <div className="absolute bottom-6 right-6 z-10">
          <button 
            onClick={() => setIsExpanded(true)}
            className="bg-primary text-white p-4 rounded-2xl shadow-2xl hover:bg-secondary active:scale-95 transition-all flex items-center space-x-2 font-bold text-sm"
          >
            <span className="material-symbols-outlined">fullscreen</span>
            <span>{t("expand_map")}</span>
          </button>
        </div>
      </div>

      {/* Expanded Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-stretch overflow-hidden">
          <div className="absolute top-6 right-6 z-50 flex items-center space-x-3">
             <div className="flex bg-white/10 backdrop-blur-xl rounded-2xl p-1.5 border border-white/10 shadow-2xl">
                <button className="px-4 py-2 hover:bg-white/10 rounded-xl transition-colors text-white text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2">
                   <span className="material-symbols-outlined text-sm">traffic</span>
                   <span>Toggle Traffic</span>
                </button>
                <div className="w-px h-4 bg-white/20 self-center"></div>
                <button className="px-4 py-2 hover:bg-white/10 rounded-xl transition-colors text-white text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2">
                   <span className="material-symbols-outlined text-sm">route</span>
                   <span>Show All Routes</span>
                </button>
             </div>
             <button 
               onClick={() => setIsExpanded(false)}
               className="bg-white text-primary p-3 rounded-2xl shadow-2xl hover:bg-neutral-100 active:scale-90 transition-all flex items-center justify-center"
             >
               <span className="material-symbols-outlined text-2xl">close</span>
             </button>
          </div>
          
          <div className="flex-grow relative">
             <iframe
               src={mapUrl}
               width="100%"
               height="100%"
               style={{ border: 0 }}
               allowFullScreen
               loading="lazy"
               referrerPolicy="no-referrer-when-downgrade"
               className="absolute inset-0 contrast-125 brightness-110"
             ></iframe>
             
             {/* Large Overlay Info */}
             <div className="absolute bottom-10 left-10 max-w-sm bg-white/95 backdrop-blur-2xl p-6 rounded-[28px] border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]">
                <div className="flex items-center space-x-3 mb-4">
                   <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-xl">map</span>
                   </div>
                   <div>
                      <h2 className="text-lg font-black text-primary tracking-tight leading-none">Addis Ababa Transit</h2>
                      <p className="text-[10px] text-outline font-bold uppercase tracking-widest mt-1">Live Network Oversight</p>
                   </div>
                </div>
                
                <div className="space-y-4">
                   <div>
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-xs font-bold text-outline">Network Load</span>
                         <span className="text-xs font-black text-primary">84%</span>
                      </div>
                      <div className="w-full h-1.5 bg-primary/10 rounded-full overflow-hidden">
                         <div className="h-full bg-primary w-[84%] rounded-full"></div>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-3">
                      <div className="bg-surface-container-low p-3 rounded-2xl">
                         <span className="text-[9px] text-outline font-bold uppercase tracking-widest block mb-1">Active Buses</span>
                         <span className="text-lg font-black text-primary">124</span>
                      </div>
                      <div className="bg-surface-container-low p-3 rounded-2xl">
                         <span className="text-[9px] text-outline font-bold uppercase tracking-widest block mb-1">Avg Delay</span>
                         <span className="text-lg font-black text-error">4.2m</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
}
