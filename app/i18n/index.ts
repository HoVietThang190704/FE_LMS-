// Small loader for i18n messages. This keeps messages in `app/i18n` and
// allows future wiring for next-intl or a custom t() helper.
import en from './en.json';
import vi from './vi.json';

export const messages: Record<string, any> = {
  en,
  vi,
};

export function getMessages(locale: 'en' | 'vi') {
  return messages[locale] || en;
}

export default { messages, getMessages };
