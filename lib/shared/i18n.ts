import { useMemo } from 'react';
import { getMessages, DEFAULT_LOCALE, type SupportedLocale } from '@/app/i18n';

export const LOCALE_STORAGE_KEY = 'lms:locale';

export function detectBrowserLocale(): SupportedLocale {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return DEFAULT_LOCALE;

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored) {
    const s = stored.toLowerCase();
    if (s.startsWith('en')) return 'en';
    if (s.startsWith('vi')) return 'vi';
  }

  const lang = navigator.language || navigator.languages?.[0] || DEFAULT_LOCALE;
  if (lang.startsWith('en')) return 'en';
  if (lang.startsWith('vi')) return 'vi';
  return DEFAULT_LOCALE;
}

export const useT = (locale?: SupportedLocale) => {
  const resolved = locale ?? detectBrowserLocale();
  const messages = useMemo<Record<string, unknown>>(
    () => getMessages(resolved) as Record<string, unknown>,
    [resolved]
  );

  const t = (path: string, params?: Record<string, string | number>) => {
    const parts = path.split('.');
    let current: unknown = messages;

    for (const part of parts) {
      if (typeof current !== 'object' || current === null) {
        return path;
      }

      current = (current as Record<string, unknown>)[part];
      if (current === undefined) return path;
    }

    if (typeof current === 'string' && params) {
      return current.replace(/\{(\w+)\}/g, (_match, key) => String(params[key] ?? ''));
    }

    if (typeof current === 'string') {
      return current;
    }

    if (typeof current === 'object' && current !== null) {
      return JSON.stringify(current);
    }

    return path;
  };

  return { t, locale: resolved } as const;
};