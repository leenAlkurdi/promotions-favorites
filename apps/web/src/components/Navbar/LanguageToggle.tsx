"use client";

import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export function LanguageToggle() {
  const { i18n, t } = useTranslation();

  const currentLocale = (i18n.language as "en" | "ar") ?? "en";
  const nextLocale = currentLocale === "en" ? "ar" : "en";

  useEffect(() => {
    const dir = currentLocale === "ar" ? "rtl" : "ltr";
    if (typeof document !== "undefined") {
      document.documentElement.dir = dir;
    }
  }, [currentLocale]);

  const toggleLang = () => {
    i18n.changeLanguage(nextLocale);
    if (typeof document !== "undefined") {
      document.documentElement.dir = nextLocale === "ar" ? "rtl" : "ltr";
    }
  };

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={t("navbar.language")}
      title={t("navbar.language")}
      className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white hover:bg-accent hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 active:scale-95 cursor-pointer transition"
    >
      <Languages className="h-5 w-5" />
      <span className="sr-only">
        {nextLocale === "ar" ? "التبديل إلى العربية" : "Switch to English"}
      </span>
    </button>
  );
}
