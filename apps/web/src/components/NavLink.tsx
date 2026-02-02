"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  exact?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
};

export default function NavLink({
  href,
  children,
  className = "",
  exact = false,
  icon,
  onClick,
}: Props) {
  const pathname = usePathname() || "/";

  // normalize by stripping locale prefix like /en or /ar
  const normalize = (p: string) => p.replace(/^\/(en|ar)(?=\/|$)/, "") || "/";
  const active = exact
    ? normalize(pathname) === normalize(href)
    : normalize(pathname).startsWith(normalize(href));

  const dir =
    typeof document !== "undefined"
      ? document.documentElement.dir || "ltr"
      : "ltr";

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`${className} ${active ? "aria-current-page" : ""}`}
    >
      <span className="flex items-center gap-2">
        {icon && dir === "ltr" ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        <span>{children}</span>
        {icon && dir === "rtl" ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
      </span>
    </Link>
  );
}
