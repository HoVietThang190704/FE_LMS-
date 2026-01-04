import React from 'react';
import { cookies } from 'next/headers';
import HomePageClient from './HomePageClient';
import { getMessages } from '../i18n';
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
    averageGrade: '0',
    learningProgress: 0,
  },
  classes: [],
  assignments: [],
  notifications: [],
  courses: [],
};

async function loadHomeData(token: string | null): Promise<HomePayload> {
  try {
    return await fetchFromApi<HomePayload>('/api/home', { token });
  } catch (error) {
    console.error('[HomePage] Failed to load backend data', error);
    return FALLBACK_HOME_PAYLOAD;
  }
}

export default async function HomePage() {
  const locale: 'en' | 'vi' = 'vi';
  const messages = getMessages(locale);
  const cookieStore = await cookies();
  const token = cookieStore.get('edu.lms.accessToken')?.value || null;
  const initialData = await loadHomeData(token);

  return (
    <HomePageClient
      locale={locale}
      messages={messages}
      initialData={initialData}
    />
  );
}
