import React from 'react';
import Image from 'next/image';
import { BookOpen, Home, Award, BarChart3, User } from 'lucide-react';
import Link from 'next/link';
import { IMAGES } from '@/lib/shared/constants/images';
import { LOGO_SIZE, ICON_L, ICON_XXXL } from '@/lib/shared/constants/size';

export default function Navbar() {
  const navItems = [
    { label: 'Trang chủ', icon: Home, href: '/', active: true },
    { label: 'Khóa học', icon: BookOpen, href: '/courses', active: false },
    { label: 'Bảng điểm', icon: Award, href: '/grades', active: false },
    { label: 'Báo cáo', icon: BarChart3, href: '/reports', active: false },
  ];

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
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon size={ICON_L.WIDTH} />
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Nguyễn Văn A</p>
            </div>
            <div className="bg-blue-600 text-white rounded-full p-2">
              <User size={ICON_XXXL.WIDTH} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
