"use client";

interface UsageTrendsProps {
  t: (key: string) => string;
}

export function UsageTrends({ t }: UsageTrendsProps) {
  return (
    <section className="bg-surface-container-low rounded-xl p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
        <div>
          <h3 className="text-lg font-black tracking-tight text-on-surface">{t("usage_trends")}</h3>
          <p className="text-xs text-on-surface-variant leading-tight">Hourly daily volume for all active zones</p>
        </div>
        <div className="flex bg-surface-container-highest p-1 rounded-lg">
          <button className="px-3 py-1 text-[10px] font-bold rounded-md bg-white text-primary shadow-sm">Hourly</button>
          <button className="px-3 py-1 text-[10px] font-bold rounded-md text-on-surface-variant">Daily</button>
          <button className="px-3 py-1 text-[10px] font-bold rounded-md text-on-surface-variant">Weekly</button>
        </div>
      </div>
      {/* Chart Visualization */}
      <div className="relative h-80 w-full bg-surface-container-lowest rounded-xl overflow-hidden group">
        <div className="absolute inset-0 grid grid-cols-12 pointer-events-none opacity-10">
          {Array.from({ length: 11 }).map((_, i) => <div key={i} className="border-r border-outline"></div>)}
        </div>
        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-10">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="border-b border-outline w-full"></div>)}
        </div>
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
          <defs>
            <linearGradient id="chart-grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#003d9b" stopOpacity="0.3"></stop>
              <stop offset="100%" stopColor="#003d9b" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
          <path d="M0,250 L50,230 L100,245 L150,180 L200,190 L250,120 L300,150 L350,100 L400,60 L450,140 L500,160 L550,80 L600,40 L650,70 L700,110 L750,95 L800,150 L850,200 L900,180 L950,220 L1000,210 L1000,300 L0,300 Z" fill="url(#chart-grad)"></path>
          <path d="M0,250 L50,230 L100,245 L150,180 L200,190 L250,120 L300,150 L350,100 L400,60 L450,140 L500,160 L550,80 L600,40 L650,70 L700,110 L750,95 L800,150 L850,200 L900,180 L950,220 L1000,210" fill="none" stroke="#003d9b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
        </svg>
        <div className="absolute top-12 left-[40%] bg-on-surface text-white px-4 py-2 rounded-lg shadow-xl text-xs flex flex-col items-center">
          <span className="font-bold">14:00 PM</span>
          <span className="text-[10px] opacity-70">Peak Usage</span>
          <span className="text-lg font-black">2,480 pkts</span>
          <div className="w-px h-24 bg-on-surface absolute top-full"></div>
        </div>
      </div>
    </section>
  );
}
