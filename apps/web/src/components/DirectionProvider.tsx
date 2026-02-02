"use client";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function DirectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();

  useEffect(() => {
    try {
      const dir = i18n?.dir?.() ?? "ltr";
      document.documentElement.dir = dir;
    } catch (e) {
      document.documentElement.dir = "ltr";
    }
  }, [i18n?.language]);

  return <>{children}</>;
}
