export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'edu.lms.accessToken',
  REFRESH_TOKEN: 'edu.lms.refreshToken',
  USER: 'edu.lms.user',
  REMEMBERED_EMAIL: 'edu.lms.rememberedEmail'
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export const AUTH_SESSION_EVENT = 'edu.lms.auth-session-change';
