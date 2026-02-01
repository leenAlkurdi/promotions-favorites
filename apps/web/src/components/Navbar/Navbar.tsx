// Navbar.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { LanguageToggle } from "./LanguageToggle";
import NavbarTabs from "./NavbarTabs";

export default function Navbar() {
    const { t } = useTranslation();
    const [mobileOpen, setMobileOpen] = useState(false);
    useCloseOnEscape(mobileOpen, setMobileOpen);

    return (
        <header className="bg-white border-b border-gray-300">
            <div className="max-w-6xl mx-auto px-4 flex items-center h-16 justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <Image src="/logo.png" alt="7awel" width={32} height={32} className="h-8 w-auto" priority />
                    <span className="font-semibold text-primary text-lg">7awel</span>
                </Link>

                {/* Search */}
                <div className="flex-1 max-w-md">
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
                            type="text"
                            placeholder={t("Search promotions,merchants...")}
                            className="
    w-full pl-10 pr-4 py-2
    text-sm
    bg-input
    rounded-lg
    placeholder:text-textMuted
    focus:outline-none
    focus:ring-2
    focus:ring-primary/40
    transition
  "
                        />

                    </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-3">
                    <LanguageToggle />
                    <button
                        className="sm:hidden p-2 rounded-md hover:bg-gray-100"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        <svg
                            className="h-6 w-6 text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {mobileOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-300">
                <nav className="max-w-6xl mx-auto px-4 mt-1">
                    <div className={`${mobileOpen ? "block" : "hidden"} sm:block`}>
                        <NavbarTabs
                            vertical={mobileOpen}
                            onItemClick={() => setMobileOpen(false)}
                        />

                    </div>
                </nav>
            </div>
        </header>
    );
}

// Close on Escape
function useCloseOnEscape(mobileOpen: boolean, setMobileOpen: (v: boolean) => void) {
    useEffect(() => {
        if (!mobileOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMobileOpen(false);
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [mobileOpen, setMobileOpen]);
}
