import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
      <div className="mx-auto h-16 w-16 rounded-full bg-input flex items-center justify-center text-2xl text-primary font-semibold">
        404
      </div>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-textSecondary">
        The page you are looking for does not exist. Check the address or head
        back to promotions.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link
          href="/promotions"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Go to promotions
        </Link>
        <Link
          href="/favorites"
          className="rounded-md border px-4 py-2 text-sm font-medium text-textPrimary hover:bg-gray-50"
        >
          View favorites
        </Link>
      </div>
    </main>
  );
}
