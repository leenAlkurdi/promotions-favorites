"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import dynamic from 'next/dynamic';
import DirectionProvider from '@/components/DirectionProvider';

const ToastProvider = dynamic(() => import('@/lib/ToastProvider').then((m) => m.ToastProvider), { ssr: false });

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <DirectionProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </DirectionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
