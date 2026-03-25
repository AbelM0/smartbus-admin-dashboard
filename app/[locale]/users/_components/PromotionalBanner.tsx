"use client";

export function PromotionalBanner() {
  return (
    <section className="bg-surface-container-high rounded-xl p-5 flex items-center justify-between overflow-hidden relative">
      <div className="relative z-10 max-w-lg">
        <span className="px-2 py-0.5 bg-primary text-white text-[9px] font-bold rounded mb-2.5 inline-block">SYSTEM NOTICE</span>
        <h3 className="text-lg font-bold text-on-surface-variant leading-tight">Integration with Telebirr 2.0 now live for all Addis Ababa transit corridors.</h3>
        <p className="text-xs text-on-surface-variant mt-1.5">Commuters can now link their Telebirr accounts for automatic card balance replenishment.</p>
      </div>
      <div className="hidden md:block absolute right-0 top-0 h-full w-1/3">
        <div className="w-full h-full bg-gradient-to-l from-primary-container/20 to-transparent flex items-center justify-center">
          <span className="material-symbols-outlined text-[120px] text-primary/10">rss_feed</span>
        </div>
      </div>
    </section>
  );
}
