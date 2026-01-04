import en from './en.json';
import vi from './vi.json';

export const messages: Record<'en' | 'vi', Record<string, unknown>> = {
  en,
  vi
} as const;

export type SupportedLocale = keyof typeof messages;

export const DEFAULT_LOCALE: SupportedLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE === 'en' ? 'en' : 'vi';

export function getMessages(locale: SupportedLocale = DEFAULT_LOCALE) {
  return messages[locale] || en;
}

export function resolveMessage(value: unknown, fallback?: string): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const v = value as Record<string, unknown>;
    if (typeof v.title === 'string') return v.title;
  }
  return fallback || '';
}

const i18n = { messages, getMessages, DEFAULT_LOCALE, resolveMessage };
export default i18n;
