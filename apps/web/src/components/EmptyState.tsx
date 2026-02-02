import Link from "next/link";
import { Tag } from "lucide-react";

type Props = {
  title?: string;
  body?: string;
  cta?: string;
};

export default function EmptyState({
  title = "No promotions",
  body = "There are no promotions to show right now.",
  cta = "Browse promotions",
}: Props) {
  return (
    <div className="py-20 text-center">
      <div className="mx-auto max-w-md">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-main-alt">
          <Tag className="h-10 w-10 text-textMuted" />
        </div>

        <h2 className="text-lg font-semibold mb-2 text-textPrimary">
          {title}
        </h2>

        <p className="text-sm text-textSecondary mb-5">
          {body}
        </p>

        <Link
          href="/promotions"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
