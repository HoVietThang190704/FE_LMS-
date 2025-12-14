'use client';

import React, { createContext, useCallback, useRef, useState } from 'react';
import { TIMING } from '@/lib/shared/constants/timing';

export type ToastType = 'success' | 'error';

export interface ToastState {
  type: ToastType;
  message: string;
  isVisible: boolean;
}

interface ToastContextType {
  toast: ToastState;
  showToast: (type: ToastType, message: string) => void;
  hideToast: () => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    type: 'success',
    message: '',
    isVisible: false,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hideToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  const showToast = useCallback((type: ToastType, message: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast({
      type,
      message,
      isVisible: true,
    });

    timeoutRef.current = setTimeout(() => {
      hideToast();
    }, TIMING.TOAST_DISMISS);
  }, [hideToast]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const value: ToastContextType = {
    toast,
    showToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};
