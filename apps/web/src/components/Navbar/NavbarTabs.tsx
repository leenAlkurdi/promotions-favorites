"use client";
import NavLink from "@/components/NavLink";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
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
  const isPromotions =
    pathname?.startsWith("/promotions") || (!isFavorites && pathname === "/");

  const containerClass = vertical
    ? `flex flex-col gap-3 ${className}`
    : `flex items-center gap-6 ${className}`;

  const baseTab =
    "relative px-2 py-2 text-sm font-medium transition-colors duration-200 after:absolute after:left-0 after:-bottom-1 after:h-1 after:rounded-full after:bg-primary after:transition-all after:duration-300";

  const inactive = "text-textSecondary after:w-0 hover:text-primary";
  const active = "text-primary after:w-full";

  return (
    <div role="tablist" className={containerClass}>
      <NavLink
        href="/promotions"
        className={`${baseTab} ${isPromotions ? active : inactive} flex items-center`}
        exact
        icon={<Tags size={16} className="mr-2" />}
        onClick={onItemClick}
      >
        {t("navbar.tabs.all")}
      </NavLink>

      <NavLink
        href="/favorites"
        className={`${baseTab} ${isFavorites ? active : inactive} flex items-center`}
        icon={<Heart size={16} className="mr-2" />}
        onClick={onItemClick}
      >
        {t("navbar.tabs.favorites")}
      </NavLink>
    </div>
  );
}
