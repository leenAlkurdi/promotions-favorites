"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "next-i18next";

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const { i18n, t } = useTranslation();

  const currentLocale = (i18n.language as "en" | "ar") ?? "en";
  const nextLocale = currentLocale === "en" ? "ar" : "en";

  const toggleLang = () => {
    const cleanPath = pathname.replace(/^\/(en|ar)/, "");
    router.push(`/${nextLocale}${cleanPath || "/"}`);
    // immediately set dir for client-rendered pages
    if (typeof document !== 'undefined') {
      document.documentElement.dir = nextLocale === 'ar' ? 'rtl' : 'ltr';
    }
  };

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={typeof t === 'function' ? t(
        "common.switchLanguage",
        nextLocale === "ar" ? "التبديل إلى العربية" : "Switch to English"
      ) : (nextLocale === 'ar' ? 'التبديل إلى العربية' : 'Switch to English')}
      className="
    flex h-10 w-10 items-center justify-center
    rounded-lg
    bg-primary text-white
    shadow-md
    transition-all duration-150
    hover:bg-accent hover:shadow-lg
    focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
    active:scale-95
    cursor-pointer
  "
    >
      <Languages className="h-5 w-5" />
    </button>
  );
}
