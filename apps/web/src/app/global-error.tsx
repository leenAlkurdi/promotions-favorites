"use client";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-input flex items-center justify-center text-2xl text-primary font-semibold">
            !
          </div>
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="text-sm text-textSecondary">
            An unexpected error occurred. You can try again or go back to promotions.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Try again
            </button>
            <a
              href="/promotions"
              className="rounded-md border px-4 py-2 text-sm font-medium text-textPrimary hover:bg-gray-50"
            >
              Go to promotions
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
