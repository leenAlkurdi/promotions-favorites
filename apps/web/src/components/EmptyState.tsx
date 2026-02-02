import Link from 'next/link';
import React from 'react';

export default function EmptyState({ title = 'No promotions', body = 'There are no promotions to show right now.', cta = 'Browse promotions' }: { title?: string; body?: string; cta?: string }) {
  return (
    <div className="py-20 text-center">
      <div className="mx-auto max-w-md">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4 text-gray-300">
          <path d="M3 7h18M6 7v13a1 1 0 001 1h10a1 1 0 001-1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 3h8v4H8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-textSecondary mb-4">{body}</p>
        <Link href="/" className="inline-block px-4 py-2 bg-primary text-white rounded-md">{cta}</Link>
      </div>
    </div>
  );
}
