"use client";

import { SlidersHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMerchants } from "@/services/promotionsApi";

type Filters = {
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

  const [merchant, setMerchant] = useState(initial.merchant ?? "");
  const [expiresBefore, setExpiresBefore] = useState(
    initial.expiresBefore ?? ""
  );
  const [merchantsList, setMerchantsList] = useState<string[]>(merchants);
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth >= 640 : true
  );

  /* ------------------ Load merchants ------------------ */
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
  }, []);

  /* ------------------ Detect screen size ------------------ */
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ------------------ Apply filters ------------------ */
  const applyFilters = () => {
    const filters: Filters = {
      merchant: merchant || undefined,
      expiresBefore: expiresBefore || undefined,
    };

    onChange?.(filters);

    const params = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );

    if (filters.merchant)
      params.set("merchant", filters.merchant);
    else params.delete("merchant");

    if (filters.expiresBefore)
      params.set("expiresBefore", filters.expiresBefore);
    else params.delete("expiresBefore");

    params.set("page", "1");

    router.replace(`/?${params.toString()}`);
  };

  /* ------------------ Desktop auto-apply ------------------ */
  useEffect(() => {
    if (!isDesktop) return;
    const t = setTimeout(() => applyFilters(), 300);
    return () => clearTimeout(t);
  }, [merchant, expiresBefore, isDesktop]);

  return (
    <>
      {/* ================= Desktop Layout ================= */}
      <div className="hidden sm:flex items-center justify-between mb-5">
        {/* Left: Title */}
        <div>
          <div className="text-lg font-medium">Promotions</div>
          <div className="text-sm text-textMuted">Filter promotions</div>
        </div>

        {/* Right: Filters group */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 flex items-center justify-center rounded-md bg-input text-textMuted">
            <SlidersHorizontal size={18} />
          </div>

          <select
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            className="
              h-9 rounded-md bg-input border border-gray-300
              text-sm text-textPrimary px-3 pr-8
              focus:outline-none focus:ring-2 focus:ring-primary/50
              hover:border-primary transition
            "
          >
            <option value="">All merchants</option>
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
              h-9 rounded-md bg-input border border-gray-300
              px-3 text-sm text-textPrimary
              focus:outline-none focus:ring-2 focus:ring-primary
            "
          />
        </div>
      </div>

      {/* ================= Mobile Layout ================= */}
      <div className="sm:hidden mb-5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-input border text-sm"
        >
          <SlidersHorizontal size={16} />
          Filter
        </button>
      </div>

      {/* ================= Mobile Bottom Sheet ================= */}
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 space-y-4 max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between">
              <span className="font-medium">Filters</span>
              <button className="text-lg" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-sm text-textMuted">
                Merchant
              </label>
              <select
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full h-10 rounded-md border px-3"
              >
                <option value="">All merchants</option>
                {merchantsList.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <label className="block text-sm text-textMuted">
                Expiry before
              </label>
              <input
                type="date"
                value={expiresBefore}
                onChange={(e) => setExpiresBefore(e.target.value)}
                className="w-full h-10 rounded-md border px-3"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                className="flex-1 h-10 rounded-md bg-primary text-white"
                onClick={() => {
                  applyFilters();
                  setOpen(false);
                }}
              >
                Apply filters
              </button>

              <button
                className="flex-1 h-10 rounded-md border"
                onClick={() => {
                  setMerchant("");
                  setExpiresBefore("");
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
