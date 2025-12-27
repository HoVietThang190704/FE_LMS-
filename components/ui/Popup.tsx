"use client";

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MODAL_MAX_WIDTHS } from '@/lib/shared/constants/size';

export interface PopupProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: keyof typeof MODAL_MAX_WIDTHS;
  maxWidthClass?: string;
  className?: string;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  headerDivider?: boolean;
  footerDivider?: boolean;
  overlayOpacity?: number;
  panelOpacity?: number;
} 

export default function Popup({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  maxWidthClass,
  className = '',
  closeOnBackdrop = true,
  showCloseButton = true,
  headerDivider = false,
  footerDivider = false,
  overlayOpacity = 40,
  panelOpacity = 100,
}: PopupProps) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = orig;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open && containerRef.current) {
      containerRef.current.focus();
    }
  }, [open]);

  if (!mounted) return null;
  if (!open) return null;

  return createPortal(
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="absolute inset-0 transition-opacity"
        style={{ backgroundColor: `rgba(0,0,0, ${overlayOpacity / 100})` }}
      />

      <div
        ref={containerRef}
        tabIndex={-1}
        className={`relative z-10 mx-auto w-full ${maxWidthClass ?? MODAL_MAX_WIDTHS[size ?? 'md'] ?? 'max-w-2xl'} ${className}`}
      >
        <div
          className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden"
          style={panelOpacity < 100 ? {
            backgroundColor: `rgba(255,255,255, ${panelOpacity / 100})`,
            backdropFilter: 'blur(4px)'
          } : undefined}
        >
          {(title || showCloseButton) && (
            <div className={`flex items-start justify-between gap-4 p-4 ${headerDivider ? 'border-b' : ''}`}>
              <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</div>
              {showCloseButton && (
                <button
                  aria-label="Close dialog"
                  onClick={onClose}
                  className="ml-2 rounded-md p-1 text-slate-600 hover:bg-slate-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          )}

          <div className="p-4">{children}</div>

          {footer && <div className={`p-4 ${footerDivider ? 'border-t' : ''}`}>{footer}</div>}
        </div>
      </div>
    </div>,
    document.body,
  );
}
