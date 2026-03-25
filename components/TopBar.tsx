"use client";

import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "./LanguageSwitcher";

export default function TopBar() {
  const t = useTranslations("topbar");

  return (
    <header className="flex justify-between items-center w-full px-6 py-2.5 sticky top-0 bg-[#faf8ff] z-30 border-b border-outline-variant/10">
      <div className="flex items-center bg-surface-container rounded-full px-3 py-1.5 w-80">
        <span className="material-symbols-outlined text-outline mr-2 text-xl">search</span>
        <input
          className="bg-transparent border-none focus:ring-0 text-xs w-full placeholder:text-outline outline-none"
          placeholder={t("search_placeholder")}
          type="text"
        />
      </div>
      <div className="flex items-center space-x-6">
        <LanguageSwitcher />
        <div className="flex items-center space-x-2">
          <button className="text-outline hover:bg-[#e1e2ec] p-1.5 rounded-full transition-colors">
            <span className="material-symbols-outlined text-sm">notifications</span>
          </button>
          <button className="text-outline hover:bg-[#e1e2ec] p-1.5 rounded-full transition-colors">
            <span className="material-symbols-outlined text-sm">settings</span>
          </button>
        </div>
        <div className="flex items-center space-x-3 border-l border-outline-variant/30 pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-primary leading-none">Alex Rivera</p>
            <p className="text-[9px] text-outline font-medium">{t("director")}</p>
          </div>
          <img
            alt="Alex Rivera"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/10"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4CiC_KTKGc61UCfsaA2QRYlYfSwVV0n1ibgA2uRFe9hJjWgQvF4dmR5hsX-gt051PraduVsuOElHu7cL7sz6B_zndUaPoBX3ByWGkRghLp1o_CmWmY6rsGodAD_rsrdSzYGCAv1caDRNu_F4UiTdLA2Ta2EpMwwoTScXMokqGYY_ltidTIlTQe_CfUB1oUdRanf7awGIOi0R5thtuIF5UQ7AE3Vn1RoTl77MztptwFsOy6A9vfun5jPmWUR34UUKGjncl04qiE-5u"
          />
        </div>
      </div>
    </header>
  );
}
