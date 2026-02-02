"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import dynamic from 'next/dynamic';
import DirectionProvider from '@/components/DirectionProvider';
import i18n from '@/lib/i18n';

const ToastProvider = dynamic(() => import('@/lib/ToastProvider').then((m) => m.ToastProvider), { ssr: false });

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <DirectionProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </DirectionProvider>
      </I18nextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
