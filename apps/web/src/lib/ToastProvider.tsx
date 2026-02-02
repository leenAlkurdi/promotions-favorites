"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, Info } from "lucide-react"; // أيقونات
import { useTranslation } from "react-i18next";

type Toast = { id: number; type: "success" | "error" | "info"; message: string; traceId?: string };

type ToastApi = {
  success: (keyOrText: string, opts?: { traceId?: string; params?: Record<string, unknown> }) => void;
  error: (keyOrText: string, opts?: { traceId?: string; params?: Record<string, unknown> }) => void;
  info: (keyOrText: string, opts?: { traceId?: string; params?: Record<string, unknown> }) => void;
};

let ToastContext: React.Context<ToastApi | null> | null = null;

const noopApi: ToastApi = {
  success: () => {},
  error: () => {},
  info: () => {},
};

const toastApiRef: { current: ToastApi } = { current: noopApi };

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (typeof window !== "undefined" && ToastContext === null) {
    ToastContext = React.createContext<ToastApi | null>(null);
  }

  const { t } = useTranslation();

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [dir, setDir] = useState<string>(() => typeof document !== "undefined" ? document.documentElement.dir || "ltr" : "ltr");

  useEffect(() => {
    const obs = new MutationObserver(() => setDir(document.documentElement.dir || "ltr"));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["dir"] });
    return () => obs.disconnect();
  }, []);

  const translate = (keyOrText: string, params?: Record<string, unknown>): string => {
    if (!keyOrText) return "";
    try {
      const translated = t(keyOrText, params as any);
      if (typeof translated === "string") return translated;
      if (translated == null) return keyOrText;
      return String(translated);
    } catch (_) {
      return keyOrText;
    }
  };

  const add = (type: Toast["type"], message: string, opts?: { traceId?: string; params?: Record<string, unknown> }) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const resolvedMessage = translate(message, opts?.params);
    setToasts((s) => [...s, { id, type, message: resolvedMessage, traceId: opts?.traceId }]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 4500);
  };

  const value: ToastApi = {
    success: (msg: string, opts?: { traceId?: string; params?: Record<string, unknown> }) => add("success", msg, opts),
    error: (msg: string, opts?: { traceId?: string; params?: Record<string, unknown> }) => add("error", msg, opts),
    info: (msg: string, opts?: { traceId?: string; params?: Record<string, unknown> }) => add("info", msg, opts),
  };

  useEffect(() => {
    toastApiRef.current = value;
    return () => { toastApiRef.current = noopApi; };
  }, [value]);

  if (!ToastContext) return <>{children}</>;

  const iconMap = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertTriangle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const palette = {
    success: "border-green-500 bg-green-50 text-green-800",
    error: "border-red-500 bg-red-50 text-red-800",
    info: "border-blue-500 bg-blue-50 text-blue-800",
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        dir={dir}
        className="fixed inset-4 flex flex-col items-end pointer-events-none z-[9999]"
      >
        {toasts.map((tst) => (
          <div
            key={tst.id}
            role="status"
            className={`pointer-events-auto mb-2 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-md text-sm transition-all transform hover:scale-105 ${palette[tst.type]}`}
          >
            <span>{iconMap[tst.type]}</span>
            <div className="flex flex-col">
              <span className="font-medium">{tst.message}</span>
              {tst.traceId && <small className="opacity-60 select-none">#{tst.traceId}</small>}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastApi => {
  if (typeof window === "undefined") return noopApi;
  if (!ToastContext) return noopApi;
  const ctx = React.useContext(ToastContext);
  return ctx ?? noopApi;
};

export const getToast = (): ToastApi => {
  if (typeof window === "undefined") return noopApi;
  return toastApiRef.current;
};

export default ToastProvider;
