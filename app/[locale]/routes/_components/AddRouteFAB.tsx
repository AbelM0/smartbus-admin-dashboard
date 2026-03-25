"use client";

export function AddRouteFAB() {
  return (
    <button className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-white rounded-xl shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50">
      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'opsz' 20" }}>add</span>
    </button>
  );
}
