'use client';

import React from 'react';
import { useToast } from '@/app/hooks/useToast';

export default function ToastDemo() {
  const toast = useToast();

  const handleSuccessClick = () => {
    toast.success('Thao tác thành công!');
  };

  const handleErrorClick = () => {
    toast.error('Đã xảy ra lỗi. Vui lòng thử lại!');
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <h2 className="text-2xl font-bold">Toast Demo</h2>

      <div className="flex gap-4">
        <button
          onClick={handleSuccessClick}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Success Toast
        </button>

        <button
          onClick={handleErrorClick}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Error Toast
        </button>
      </div>
    </div>
  );
}
