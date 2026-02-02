"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "next-i18next";
import NavbarTabs from "./NavbarTabs";
import { LanguageToggle } from "./LanguageToggle";

export default function Navbar() {
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [q, setQ] = useState(searchParams.get("q") ?? "");

    // Close on ESC
    useEffect(() => {
        if (!mobileOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [mobileOpen]);

    // Debounced search
    useEffect(() => {
        const tmr = setTimeout(() => {
            const params = new URLSearchParams(window.location.search);
            q ? params.set("q", q) : params.delete("q");
            params.set("page", "1");
                router.replace(`/promotions?${params.toString()}`);
        }, 300);

        return () => clearTimeout(tmr);
    }, [q, router]);

    return (
        <header className="bg-white border-b border-gray-300">
            {/* Top bar */}
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
                {/* Logo */}
                    <Link href="/promotions" className="flex items-center gap-2 shrink-0">
                    <Image src="/logo.png" alt="7awel" width={32} height={32} priority />

                    <span className="hidden sm:inline font-semibold text-primary text-lg">
                        7awel
                    </span>
                </Link>

                {/* Search */}
                <div className="flex-1">
                    <div className="relative">
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-textMuted"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <circle cx={11} cy={11} r={8} />
                            <line x1={21} y1={21} x2={16.65} y2={16.65} />
                        </svg>

                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder={t("Search promotions, merchants…")}
                            className="
                w-full
                pl-10 pr-4 py-2
                text-sm
                bg-input
                rounded-lg
                placeholder:text-textMuted
                focus:outline-none
                focus:ring-2
                focus:ring-primary/40
              "
                        />
                    </div>
                </div>

                {/* Desktop actions */}
                <div className="hidden sm:flex items-center gap-3">
                    <LanguageToggle />
                </div>

                {/* Mobile burger */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="sm:hidden p-2 rounded-md hover:bg-gray-100"
                >
                    <svg
                        className="h-6 w-6 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        {mobileOpen ? (
                            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Desktop tabs */}
            <div className="hidden sm:block border-t border-gray-300">
                <nav className="max-w-6xl mx-auto px-4">
                    <NavbarTabs />
                </nav>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="sm:hidden border-t border-gray-200 px-4 py-4 space-y-4">
                    <LanguageToggle />
                    <NavbarTabs vertical onItemClick={() => setMobileOpen(false)} />
                </div>
            )}
        </header>
    );
}
