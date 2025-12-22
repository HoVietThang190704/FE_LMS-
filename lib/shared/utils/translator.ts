export type TranslateFn = (key: string, params?: Record<string, string | number> | string) => string;

export function createTranslator(messages: Record<string, unknown>): TranslateFn {
  return (key, params = {}) => {
    const fallback = typeof params === 'string' ? params : undefined;
    const paramObj = typeof params === 'string' ? {} : (params as Record<string, string | number>);

    const value = key.split('.').reduce<unknown>((acc, segment) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[segment];
      }
      return undefined;
    }, messages);

    if (typeof value !== 'string') {
      return fallback ?? key;
    }

    return Object.entries(paramObj).reduce((acc, [paramKey, paramValue]) => {
      return acc.replace(`{${paramKey}}`, String(paramValue));
    }, value);
  };
}
