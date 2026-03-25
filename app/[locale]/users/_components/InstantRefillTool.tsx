"use client";

interface InstantRefillToolProps {
  t: (key: string) => string;
}

export function InstantRefillTool({ t }: InstantRefillToolProps) {
  return (
    <div className="bg-primary-container text-on-primary-container p-5 rounded-lg relative overflow-hidden shadow-xl">
      <div className="absolute -right-10 -top-10 opacity-10">
        <span className="material-symbols-outlined text-[140px]">payments</span>
      </div>
      <h3 className="text-lg font-black mb-1">{t("instant_refill")}</h3>
      <p className="text-xs opacity-80 mb-4">Process individual top-ups immediately.</p>
      <div className="space-y-4 relative z-10">
        <div className="space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-widest opacity-70">Commuter Card ID</label>
          <div className="flex items-center bg-white/10 rounded-lg p-2 group focus-within:bg-white/20 transition-all">
            <span className="material-symbols-outlined text-lg opacity-60 mr-2.5">credit_card</span>
            <input className="bg-transparent border-none text-white placeholder:text-white/40 focus:ring-0 w-full font-mono text-base tracking-wider outline-none" placeholder="e.g. SB-8821" type="text" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-bold uppercase tracking-widest opacity-70">Refill Amount (ETB)</label>
          <div className="flex items-center bg-white/10 rounded-lg p-2 group focus-within:bg-white/20 transition-all">
            <span className="material-symbols-outlined text-lg opacity-60 mr-2.5">account_balance_wallet</span>
            <input className="bg-transparent border-none text-white placeholder:text-white/40 focus:ring-0 w-full text-base font-bold outline-none" placeholder="0.00" type="number" />
          </div>
        </div>
        <div className="pt-2 flex flex-col gap-2">
          <button className="w-full py-2.5 bg-white text-primary text-xs font-extrabold rounded-lg flex items-center justify-center gap-2 shadow-lg hover:scale-[0.98] transition-transform">
            <span className="material-symbols-outlined text-lg">bolt</span>
            {t("execute_refill")}
          </button>
        </div>
      </div>
    </div>
  );
}
