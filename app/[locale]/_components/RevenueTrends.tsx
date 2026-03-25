"use client";

interface RevenueTrendsProps {
  t: (key: string) => string;
}

export function RevenueTrends({ t }: RevenueTrendsProps) {
  const data = [40, 60, 45, 75, 90, 65, 80, 55, 70, 85, 95, 100];

  return (
    <div className="bg-[#f0f1fa] rounded-[24px] p-6 border border-white/40">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h4 className="font-black text-primary text-lg tracking-tight">{t("revenue_trends")}</h4>
          <p className="text-outline text-[10px] font-medium">Financial performance across Ethiopian calendar months</p>
        </div>
        <div className="flex bg-white/50 p-1 rounded-lg">
          <button className="px-3 py-1.5 rounded-md bg-primary text-white text-[9px] font-black">2016 E.C.</button>
          <button className="px-3 py-1.5 rounded-md text-outline text-[9px] font-black">2015 E.C.</button>
        </div>
      </div>
      <div className="h-48 flex items-end justify-between px-3 space-x-1.5">
        {data.map((val, i) => (
          <div key={i} className="flex-grow flex flex-col items-center group relative">
            <div 
              className={`w-full rounded-t-xl transition-all duration-1000 ${i === 11 ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-primary/20 group-hover:bg-primary/40'}`}
              style={{ height: `${val}%` }}
            >
              {i === 11 && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded font-black whitespace-nowrap shadow-xl">
                  2.4M
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-outline mt-3">M{i+1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
