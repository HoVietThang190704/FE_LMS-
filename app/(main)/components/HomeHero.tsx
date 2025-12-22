import React from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import type { UserProfile } from '@/lib/types/home';
import type { TranslateFn } from '@/lib/shared/utils/translator';

type Props = {
  user: UserProfile;
  t: TranslateFn;
};

export default function HomeHero({ user, t }: Props) {
  return (
    <div className="mb-8 rounded-lg bg-gradient-to-r from-indigo-50 to-white p-6 border border-gray-100">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{t('greeting.hello', { name: user.name })}</h1>
          <p className="text-sm text-gray-600">{t('greeting.welcome')}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label={t('notifications.open')}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white shadow-sm rounded-md border border-gray-200"
          >
            <Bell size={18} className="text-gray-700" />
            <span className="text-sm text-gray-700">{t('notifications.title')}</span>
          </button>
          <Link href="/courses" className="ml-2 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md text-sm">
            {t('actions.viewCourses')}
          </Link>
        </div>
      </div>
    </div>
  );
}
