// NavbarTabs.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "next-i18next";
import { Heart, Tags } from "lucide-react";

type Props = {
    vertical?: boolean;
    className?: string;
    onItemClick?: () => void;
};


export default function NavbarTabs({
    vertical = false,
    className = "",
    onItemClick,
}: Props) {

    const pathname = usePathname();
    const { t } = useTranslation();
    const isFavorites = pathname?.startsWith("/favorites");

    const containerClass = vertical
        ? `flex flex-col gap-1 ${className}`
        : `flex items-center gap-6 ${className}`;

    const baseTab =
        vertical
            ? "flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition bg-transparent"
            : "relative px-2 py-2 text-sm font-medium transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-1 after:rounded-full after:bg-primary after:transition-all after:duration-300";

    const inactive =
        vertical
            ? "text-textSecondary hover:bg-gray-100"
            : "text-textSecondary after:w-0 hover:text-primary";

    const active =
        vertical
            ? "text-primary bg-primary/10"
            : "text-primary after:w-full";



    return (
        <div role="tablist" className={containerClass}>
            <Link
                href="/"
                onClick={onItemClick}
                role="tab"
                aria-selected={!isFavorites}
                className={`${baseTab} ${!isFavorites ? active : inactive} flex items-center`}
            >
                <Tags size={16} className="mr-2" />
                {t("All Promotions")}
            </Link>

            <Link
                href="/favorites"
                onClick={onItemClick}
                role="tab"
                aria-selected={isFavorites}
                className={`${baseTab} ${isFavorites ? active : inactive} flex items-center`}
            >
                <Heart size={16} className="mr-2" />
                {t("Favorites")}
            </Link>

        </div>
    );

}
