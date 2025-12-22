import React from 'react';
import HomeUI from './home-ui';
import { getMessages } from '../i18n';
import { createTranslator } from '@/lib/shared/utils/translator';
import { fetchFromApi } from '@/lib/shared/utils/api';
import type { Assignment, HomeClass, Notification, Stats, UserProfile } from '@/lib/types/home';
import type { Course } from '@/lib/api/courses';

type HomePayload = {
  user: UserProfile;
  stats: Stats;
  classes: HomeClass[];
  assignments: Assignment[];
  notifications: Notification[];
  courses: Course[];
};

const FALLBACK_HOME_PAYLOAD: HomePayload = {
  user: { name: 'Học viên' },
  stats: {
    enrolledCourses: 0,
    pendingAssignments: 0,
    averageGrade: 'N/A',
    learningProgress: 0,
  },
  classes: [],
  assignments: [],
  notifications: [],
  courses: [],
};

async function loadHomeData(): Promise<HomePayload> {
  try {
    return await fetchFromApi<HomePayload>('/api/home');
  } catch (error) {
    console.error('[HomePage] Failed to load backend data', error);
    return FALLBACK_HOME_PAYLOAD;
  }
}

export default async function HomePage() {
  const locale: 'en' | 'vi' = 'vi';
  const messages = getMessages(locale);
  const t = createTranslator(messages);
  const { user, stats, classes, assignments, notifications, courses } = await loadHomeData();

  return (
    <HomeUI
      locale={locale}
      t={t}
      messages={messages}
      user={user}
      stats={stats}
      classes={classes}
      assignments={assignments}
      notifications={notifications}
      courses={courses}
    />
  );
}
