import React from 'react';
import HomeUI from './home-ui';
import { getMessages } from '../i18n';
import { createTranslator } from '@/lib/shared/utils/translator';
import { mockStats, mockClasses, mockAssignments, mockNotifications, mockUserProfile } from '@/lib/mocks/homeData';

export default function HomePage() {
  const locale: 'en' | 'vi' = 'vi';
  const messages = getMessages(locale);
  const t = createTranslator(messages);

  // page-level logic can go here (data fetching, filtering, etc.)
  return (
    <HomeUI
      locale={locale}
      t={t}
      user={mockUserProfile}
      stats={mockStats}
      classes={mockClasses}
      assignments={mockAssignments}
      notifications={mockNotifications}
    />
  );
}
