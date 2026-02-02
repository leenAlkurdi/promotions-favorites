"use client";
import { SlidersHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Filters = {
  merchant?: string;
  expiresBefore?: string;
};

type Props = {
  initial?: Filters;
  onChange?: (filters: Filters) => void;
  merchants?: string[]; // optional: dropdown
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

  useEffect(() => {
    const t = setTimeout(() => {
      const filters: Filters = {
        merchant: merchant || undefined,
        expiresBefore: expiresBefore || undefined,
      };

      onChange?.(filters);

      const params = new URLSearchParams();
      if (filters.merchant) params.set("merchant", filters.merchant);
      if (filters.expiresBefore)
        params.set("expiresBefore", filters.expiresBefore);

      router.replace(`/?${params.toString()}`);
    }, 300);

    return () => clearTimeout(t);
  }, [merchant, expiresBefore, onChange, router]);

  return (
    <div className="flex items-center justify-between gap-3 mb-5">
      {/* Left side (title optional) */}
      <div className="text-sm text-textMuted">
        Filter promotions
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Merchant */}
        <select
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
          className="h-9 rounded-md bg-input px-3 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All merchants</option>
          {merchants.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* Expiry */}
        <input
          type="date"
          value={expiresBefore}
          onChange={(e) => setExpiresBefore(e.target.value)}
          className="h-9 rounded-md bg-input px-3 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Filters icon (mobile / future) */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md bg-input text-textMuted hover:text-primary"
          aria-label="More filters"
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}
