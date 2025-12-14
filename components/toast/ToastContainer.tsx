'use client';

import React, { useContext } from 'react';
import { ToastContext } from '@/app/context/ToastContext';
import ToastMessage from '@/components/toast/ToastMessage';

const ToastContainer: React.FC = () => {
  const context = useContext(ToastContext);

  if (!context) {
    return null;
  }

  const { toast } = context;

  return (
    <ToastMessage
      type={toast.type}
      message={toast.message}
      isVisible={toast.isVisible}
    />
  );
};

export default ToastContainer;
