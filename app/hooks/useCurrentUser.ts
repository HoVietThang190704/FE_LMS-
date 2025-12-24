'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS, AUTH_SESSION_EVENT } from '@/lib/shared/constants/storage';

export type StoredUser = {
  id: string;
  email: string;
  fullName?: string;
  userName?: string;
  avatar?: string;
};

const storageKeySet = new Set<string>(Object.values(STORAGE_KEYS));

const parseStoredUser = (raw: string | null): StoredUser | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
};

export const useCurrentUser = () => {
  const [user, setUser] = useState<StoredUser | null>(null);

  const syncFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    const storedUser = window.localStorage.getItem(STORAGE_KEYS.USER);
    setUser(parseStoredUser(storedUser));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    syncFromStorage();

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || storageKeySet.has(event.key)) {
        syncFromStorage();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(AUTH_SESSION_EVENT, syncFromStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(AUTH_SESSION_EVENT, syncFromStorage);
    };
  }, [syncFromStorage]);

  const displayName = useMemo(() => {
    if (!user) return undefined;
    return user.fullName?.trim() || user.userName?.trim() || user.email;
  }, [user]);

  return { user, displayName } as const;
};
