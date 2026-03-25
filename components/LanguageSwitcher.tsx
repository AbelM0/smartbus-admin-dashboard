"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onLanguageChange(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  const languages = [
    { code: "en", label: "English", flag: "US" },
    { code: "am", label: "አማርኛ", flag: "ET" },
  ];

  return (
    <div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant/10">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onLanguageChange(lang.code)}
          disabled={isPending}
          className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all duration-200 ${
            locale === lang.code
              ? "bg-primary text-on-primary shadow-sm"
              : "text-on-surface-variant hover:bg-surface-dim opacity-70 hover:opacity-100"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
