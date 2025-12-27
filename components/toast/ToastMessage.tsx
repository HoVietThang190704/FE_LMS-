'use client';

import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import type { ToastType } from '@/app/context/ToastContext';

interface ToastMessageProps {
  type: ToastType;
  message: string;
  isVisible: boolean;
}

const ToastMessage: React.FC<ToastMessageProps> = ({ type, message, isVisible }) => {
  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isSuccess ? 'border-green-200' : 'border-red-200';
  const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
  const iconColor = isSuccess ? 'text-green-600' : 'text-red-600';

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] transform transition-all duration-300 ease-in-out ${
        isVisible
          ? 'translate-x-0 opacity-100 pointer-events-auto'
          : 'translate-x-full opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`${bgColor} ${borderColor} ${textColor} px-4 py-3 rounded-lg border flex items-start gap-3 min-w-80 shadow-lg`}
      >
        <div className="flex-shrink-0 mt-0.5">
          {isSuccess ? (
            <CheckCircle className={`w-5 h-5 ${iconColor}`} />
          ) : (
            <AlertCircle className={`w-5 h-5 ${iconColor}`} />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ToastMessage;
