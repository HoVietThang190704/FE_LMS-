import { useMemo } from 'react';
import { getMessages, DEFAULT_LOCALE, type SupportedLocale } from '@/app/i18n';

export function detectBrowserLocale(): SupportedLocale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  const lang = navigator.language || navigator.languages?.[0] || DEFAULT_LOCALE;
  if (lang.startsWith('en')) return 'en';
  if (lang.startsWith('vi')) return 'vi';
  return DEFAULT_LOCALE;
}

export const useT = (locale?: SupportedLocale) => {
  const resolved = locale ?? detectBrowserLocale();
  const messages = useMemo(() => getMessages(resolved) as Record<string, any>, [resolved]);

  const t = (path: string, params?: Record<string, string | number>) => {
    const parts = path.split('.');
    let cur: any = messages;
    for (const p of parts) {
      cur = cur?.[p];
      if (cur === undefined) return path;
    }
    if (typeof cur === 'string' && params) {
      return cur.replace(/\{(\w+)\}/g, (_m, k) => String(params[k] ?? ''));
    }
    return typeof cur === 'string' ? cur : JSON.stringify(cur);
  };

  return { t, locale: resolved } as const;
};