export type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

export function createTranslator(messages: Record<string, unknown>): TranslateFn {
  return (key, params = {}) => {
    const value = key.split('.').reduce<unknown>((acc, segment) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[segment];
      }
      return undefined;
    }, messages);

    if (typeof value !== 'string') {
      return key;
    }

    return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
      return acc.replace(`{${paramKey}}`, String(paramValue));
    }, value);
  };
}
