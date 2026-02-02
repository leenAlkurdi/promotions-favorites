"use client";

import { SlidersHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMerchants } from "../services/promotionsApi";
import { useTranslation } from "react-i18next";

type Filters = {
  q?: string;
  merchant?: string;
  expiresBefore?: string;
};

type Props = {
  initial?: Filters;
  onChange?: (filters: Filters) => void;
  merchants?: string[];
};

export default function FilterBar({
  initial = {},
  onChange,
  merchants = [],
}: Props) {
  const router = useRouter();
  const { t } = useTranslation();

  const [q] = useState(initial.q ?? "");
  const [merchant, setMerchant] = useState(initial.merchant ?? "");
  const [expiresBefore, setExpiresBefore] = useState(
    initial.expiresBefore ?? "",
  );
  const [merchantsList, setMerchantsList] = useState<string[]>(merchants);
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth >= 640 : true,
  );
  const [isRtl, setIsRtl] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    if (!merchants || merchants.length === 0) {
      getMerchants()
        .then((list) => {
          if (mounted) setMerchantsList(list || []);
        })
        .catch(() => {});
    }

    return () => {
      mounted = false;
    };
  }, [merchants]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const dir = document.documentElement.dir || "ltr";
    setIsRtl(dir === "rtl");
  }, []);

  const applyFilters = () => {
    const filters: Filters = {
      q: q || undefined,
      merchant: merchant || undefined,
      expiresBefore: expiresBefore || undefined,
    };

    onChange?.(filters);

    const params = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : "",
    );

    if (filters.q) params.set("q", filters.q);
    else params.delete("q");

    if (filters.merchant) params.set("merchant", filters.merchant);
    else params.delete("merchant");

    if (filters.expiresBefore)
      params.set("expiresBefore", filters.expiresBefore);
    else params.delete("expiresBefore");

    params.set("page", "1");

    router.replace(`/promotions?${params.toString()}`);
  };

  useEffect(() => {
    if (!isDesktop) return;
    const t = setTimeout(() => applyFilters(), 300);
    return () => clearTimeout(t);
  }, [merchant, expiresBefore, isDesktop]);

  return (
    <>
      <div className="hidden sm:flex items-center justify-between mb-5">
        <div
          className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}
        >
          <div className="h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md bg-input text-textMuted">
            <SlidersHorizontal size={18} />
          </div>

          <select
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            className="
              h-11 min-h-[44px] rounded-md bg-input border border-gray-300
              text-sm text-textPrimary px-3 pr-8
              focus:outline-none focus:ring-2 focus:ring-primary/50
              hover:border-primary transition
            "
          >
            <option value="">{t("filters.merchant")}</option>
            {merchantsList.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={expiresBefore}
            onChange={(e) => setExpiresBefore(e.target.value)}
            className="
              h-11 min-h-[44px] rounded-md bg-input border border-gray-300
              px-3 text-sm text-textPrimary
              focus:outline-none focus:ring-2 focus:ring-primary
            "
          />
        </div>
      </div>

      <div className="sm:hidden mb-5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-md bg-input border text-sm"
        >
          <SlidersHorizontal size={16} />
          {t("filters.title")}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <div
            className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 space-y-4 max-h-[80vh] overflow-auto ${isRtl ? "direction-rtl" : ""}`}
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{t("filters.title")}</span>
              <button
                className="text-lg h-11 w-11 min-h-[44px] min-w-[44px] flex items-center justify-center"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-sm text-textMuted">
                {t("filters.merchant")}
              </label>
              <select
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full h-11 min-h-[44px] rounded-md border px-3"
              >
                <option value="">{t("filters.merchant")}</option>
                {merchantsList.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <label className="block text-sm text-textMuted">
                {t("filters.expiresBefore")}
              </label>
              <input
                type="date"
                value={expiresBefore}
                onChange={(e) => setExpiresBefore(e.target.value)}
                className="w-full h-11 min-h-[44px] rounded-md border px-3"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                className="flex-1 h-11 min-h-[44px] rounded-md bg-primary text-white"
                onClick={() => {
                  applyFilters();
                  setOpen(false);
                }}
              >
                {t("filters.apply")}
              </button>

              <button
                className="flex-1 h-11 min-h-[44px] rounded-md border"
                onClick={() => {
                  setMerchant("");
                  setExpiresBefore("");
                }}
              >
                {t("filters.clear")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
