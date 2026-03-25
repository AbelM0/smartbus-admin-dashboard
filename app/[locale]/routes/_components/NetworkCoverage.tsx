"use client";

interface NetworkCoverageProps {
  t: (key: string) => string;
}

export function NetworkCoverage({ t }: NetworkCoverageProps) {
  return (
    <div className="lg:col-span-2 relative group overflow-hidden rounded-xl bg-surface-container-low h-[320px]">
      <img
        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnpYSL41fX2a1vtF_t6A0Snx-kGl4SRyUHXlGvsWyrJ397dIMGPdLJjSStMNsxSK0D88_-puAPLIZY5xCQX7dKn2-WE22gfEy0III3MyVC2FCMax5ymuqcG0TOWti5OBLw7k19K_wjFWfJeTanu0ns1RoenSydjSgUj9XEdRwkZIa4_xUWjC7HbpJS-JSR7gjGncD5T2dvacYIi3ufCMfr9Ga2AeAvAjQ4mcHpj27gvcOgFXBvVP45btYHN-Xppqy7PTUGGFlnmHsN"
        alt="Addis Ababa City"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
      <div className="absolute bottom-5 left-5 text-white">
        <h3 className="text-lg font-bold">{t("network_coverage")}</h3>
        <p className="amharic-text text-white/80 text-xs">የአዲስ አበባ ትራንዚት ኮሪደሮች</p>
      </div>
      <div className="absolute top-6 right-6">
        <div className="bg-surface/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold">LIVE PULSE</span>
          </div>
          <div className="space-y-3">
            <div className="w-48">
              <div className="flex justify-between text-[10px] mb-1">
                <span>Bole Corridor</span>
                <span>88%</span>
              </div>
              <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[88%]"></div>
              </div>
            </div>
            <div className="w-48">
              <div className="flex justify-between text-[10px] mb-1">
                <span>Piazza Corridor</span>
                <span>72%</span>
              </div>
              <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-tertiary-container w-[72%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
