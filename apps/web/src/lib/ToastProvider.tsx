"use client";
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

type Toast = { id: number; type: 'success' | 'error' | 'info'; message: string; traceId?: string };

const ToastContext = createContext<{
  success: (keyOrText: string, opts?: { traceId?: string }) => void;
  error: (keyOrText: string, opts?: { traceId?: string }) => void;
  info: (keyOrText: string, opts?: { traceId?: string }) => void;
} | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [dir, setDir] = useState<string>(() => typeof document !== 'undefined' ? document.documentElement.dir || 'ltr' : 'ltr');

  useEffect(() => {
    const obs = new MutationObserver(() => setDir(document.documentElement.dir || 'ltr'));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => obs.disconnect();
  }, []);

  const add = (type: Toast['type'], keyOrText: string, opts?: { traceId?: string }) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const message = String(keyOrText);
    setToasts((s) => [...s, { id, type, message, traceId: opts?.traceId }]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 4500);
  };

  const value = useMemo(() => ({
    success: (k: string, o?: { traceId?: string }) => add('success', k, o),
    error: (k: string, o?: { traceId?: string }) => add('error', k, o),
    info: (k: string, o?: { traceId?: string }) => add('info', k, o),
  }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" aria-atomic="true" dir={dir} className="fixed inset-4 flex flex-col items-end pointer-events-none z-[9999]">
        {toasts.map((tst) => (
          <div
            key={tst.id}
            role="status"
            className={`pointer-events-auto mb-2 rounded-md px-4 py-2 shadow-md text-sm bg-white dark:bg-gray-800 border ${tst.type === 'success' ? 'border-green-300' : tst.type === 'error' ? 'border-red-300' : 'border-blue-300'}`}
          >
            <div className="flex items-center gap-2">
              <div>{tst.message}</div>
              {tst.traceId && <small className="opacity-60">#{tst.traceId}</small>}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};

export default ToastProvider;
