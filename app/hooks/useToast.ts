'use client';

import { useContext } from 'react';
import { ToastContext, type ToastType } from '@/app/context/ToastContext';

interface UseToastAPI {
  success: (message: string) => void;
  error: (message: string) => void;
}

export const useToast = (): UseToastAPI => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  const { showToast } = context;

  return {
    success: (message: string) => showToast('success', message),
    error: (message: string) => showToast('error', message),
  };
};
