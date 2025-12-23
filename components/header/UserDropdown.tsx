'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { User, Settings, Bell, Key, HelpCircle, LogOut, ChevronDown } from 'lucide-react';
import Dropdown from '@/components/ui/Dropdown';
import { ROUTES } from '@/lib/shared/constants/routeres';
import { AVATAR } from '@/lib/shared/constants/size';

type Props = {
  name?: string;
  avatarUrl?: string;
};

export default function UserDropdown({ name = 'Nguyễn Văn A', avatarUrl }: Props) {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    router.push(ROUTES.LOGIN);
  };

  const trigger = (open: boolean) => (
    <div className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors">
      <div className="flex items-center">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={name} width={AVATAR.WIDTH} height={AVATAR.HEIGHT} className="rounded-full object-cover" />
        ) : (
          <div className="bg-blue-600 text-white rounded-full p-2">
            <User size={16} />
          </div>
        )}
      </div>
      <div className="text-sm text-gray-700 hidden sm:block">
        <div className="font-medium">{name}</div>
      </div>
      <ChevronDown size={18} className={`text-gray-500 transition-transform ${open ? '' : 'rotate-180'}`} />
    </div>
  );

  return (
    <Dropdown trigger={trigger} align="end">
      <Link href={ROUTES.MY_PROFILE} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" role="menuitem">
        <User size={16} className="text-gray-500" />
        Hồ sơ cá nhân
      </Link>

      <Link href={ROUTES.SETTINGS} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" role="menuitem">
        <Settings size={16} className="text-gray-500" />
        Cài đặt
      </Link>

      <Link href={ROUTES.NOTIFICATIONS} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" role="menuitem">
        <Bell size={16} className="text-gray-500" />
        Thông báo
      </Link>

      <Link href={ROUTES.CHANGE_PASSWORD} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" role="menuitem">
        <Key size={16} className="text-gray-500" />
        Đổi mật khẩu
      </Link>

      <Link href={ROUTES.SUPPORT} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" role="menuitem">
        <HelpCircle size={16} className="text-gray-500" />
        Trợ giúp & Hỗ trợ
      </Link>

      <div className="border-t border-gray-100 my-1" />

      <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors" role="menuitem">
        <LogOut size={16} />
        Đăng xuất
      </button>
    </Dropdown>
  );
}
