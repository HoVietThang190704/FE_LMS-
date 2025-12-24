'use client';

import React, { useEffect, useRef, useState } from 'react';

export type DropdownProps = {
  trigger: React.ReactNode | ((open: boolean) => React.ReactNode);
  align?: 'start' | 'end';
  children: React.ReactNode;
  className?: string;
};

export default function Dropdown({ trigger, align = 'start', children, className = '' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const toggle = () => setOpen((s) => !s);

  return (
    <div className={`relative inline-block ${className}`} ref={rootRef}>
      <div onClick={toggle} aria-haspopup="menu" aria-expanded={open} className="cursor-pointer">
        {typeof trigger === 'function' ? (trigger as (open: boolean) => React.ReactNode)(open) : trigger}
      </div>

      {open && (
        <div
          role="menu"
          className={`absolute mt-2 w-56 bg-white rounded-md shadow-lg border-0 focus:outline-none z-50 ${
            align === 'end' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, onClick, href, className = '' }: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}) {
  const base = `w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${className}`;

  if (href) {
    return (
      <a href={href} className={base} role="menuitem">
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={base} role="menuitem">
      {children}
    </button>
  );
}
