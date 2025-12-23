'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import UserDropdown from '@/components/header/UserDropdown';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/shared/constants/navItems';
import { getMessages } from '@/app/i18n';
import { IMAGES } from '@/lib/shared/constants/images';
import { LOGO_SIZE, ICON_L } from '@/lib/shared/constants/size';

export default function Navbar() {
  const navItems = NAV_ITEMS;

  const locale = (typeof document !== 'undefined' && document.documentElement.lang)
    ? (document.documentElement.lang.startsWith('en') ? 'en' : 'vi')
    : (typeof navigator !== 'undefined' && navigator.language?.startsWith('en') ? 'en' : 'vi');
  const messages = getMessages(locale as 'en' | 'vi');

  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div
              className="relative flex items-center justify-center"
              style={{ width: LOGO_SIZE.WIDTH, height: LOGO_SIZE.HEIGHT }}
            >
              <Image
                src={IMAGES.LOGO}
                alt="Logo"
                width={LOGO_SIZE.WIDTH}
                height={LOGO_SIZE.HEIGHT}
                className="object-contain w-full h-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href || '');
              const labelKey = item.labelKey.split('.').slice(-1)[0];
              const label = (messages && messages.nav && (messages.nav as Record<string, string>)[labelKey]) || labelKey;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <item.icon size={ICON_L.WIDTH} />
                  {String(label)}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <UserDropdown name="Nguyễn Văn A" />
          </div>
        </div>
      </div>
    </nav>
  );
}
