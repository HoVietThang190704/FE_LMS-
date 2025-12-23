// Small loader for i18n messages. This keeps messages in `app/i18n` and
// allows future wiring for next-intl or a custom t() helper.
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

const i18n = { messages, getMessages, DEFAULT_LOCALE };
export default i18n;
