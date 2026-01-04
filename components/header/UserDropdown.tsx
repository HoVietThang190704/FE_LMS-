'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { User, Settings, Bell, Key, HelpCircle, LogOut, ChevronDown } from 'lucide-react';
import Dropdown from '@/components/ui/Dropdown';
import { ROUTES } from '@/lib/shared/constants/routeres';
import { AVATAR } from '@/lib/shared/constants/size';
import { STORAGE_KEYS, AUTH_SESSION_EVENT } from '@/lib/shared/constants/storage';
import { getMessages, DEFAULT_LOCALE } from '@/app/i18n';

type Props = {
  name?: string;
  avatarUrl?: string;
  isAuthenticated?: boolean;
};

export default function UserDropdown({ name, avatarUrl, isAuthenticated = false }: Props) {
  const router = useRouter();
  const messages = getMessages(DEFAULT_LOCALE) as Record<string, unknown>;
  const userMenu = (messages.userMenu ?? {}) as Record<string, string | undefined>;

  const displayName = name?.trim()
    ? name
    : isAuthenticated
      ? (userMenu.userFallback || 'User')
      : (userMenu.guest || 'Guest');

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      // Xóa cookie
      document.cookie = 'edu.lms.accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
    }
    router.push(ROUTES.LOGIN);
  };

  const trigger = (open: boolean) => (
    <div className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors">
      <div className="flex items-center">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={AVATAR.WIDTH}
            height={AVATAR.HEIGHT}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="bg-blue-600 text-white rounded-full p-2">
            <User size={16} />
          </div>
        )}
      </div>
      <div className="text-sm text-gray-700 hidden sm:block">
        <div className="font-medium">{displayName}</div>
      </div>
      <ChevronDown size={18} className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
    </div>
  );

  if (!isAuthenticated) {
    return (
      <Dropdown trigger={trigger} align="end">
        <button
          onClick={() => router.push(ROUTES.LOGIN)}
          className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
          role="menuitem"
        >
          <User size={16} />
          {userMenu.login || 'Đăng nhập'}
        </button>
      </Dropdown>
    );
  }

  return (
    <Dropdown trigger={trigger} align="end">
      <Link href={ROUTES.MY_PROFILE} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" role="menuitem">
        <User size={16} className="text-gray-500" />
        {userMenu.profile || 'Hồ sơ cá nhân'}
      </Link>
      <Link href={ROUTES.SETTINGS} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" role="menuitem">
        <Settings size={16} className="text-gray-500" />
        {userMenu.settings || 'Cài đặt'}
      </Link>

      <Link href={ROUTES.NOTIFICATIONS} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" role="menuitem">
        <Bell size={16} className="text-gray-500" />
        {userMenu.notifications || 'Thông báo'}
      </Link>

      <Link href={ROUTES.CHANGE_PASSWORD} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" role="menuitem">
        <Key size={16} className="text-gray-500" />
        {userMenu.changePassword || 'Đổi mật khẩu'}
      </Link>

      <Link href={ROUTES.SUPPORT} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" role="menuitem">
        <HelpCircle size={16} className="text-gray-500" />
        {userMenu.support || 'Trợ giúp'}
      </Link>

      <div className="border-t border-gray-100 my-1" />

      <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors" role="menuitem">
        <LogOut size={16} />
        {userMenu.logout || 'Đăng xuất'}
      </button>
    </Dropdown>
  );
}
