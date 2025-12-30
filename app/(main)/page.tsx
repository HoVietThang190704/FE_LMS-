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
    enrolledCourses: 2,
    pendingAssignments: 1,
    averageGrade: '85',
    learningProgress: 56,
  },
  classes: [
    {
      id: 'it3230',
      courseCode: 'IT3230',
      courseName: 'Cấu trúc dữ liệu và Giải thuật',
      instructor: 'PGS.TS. Trần Văn Minh',
      progress: 42,
      schedule: 'Thứ 5, 13:00 - 15:00',
      room: 'D3-301',
      lessonProgress: '13/30',
    },
    {
      id: 'it4409',
      courseCode: 'IT4409',
      courseName: 'Lập trình Web nâng cao',
      instructor: 'TS. Nguyễn Thị Lan',
      progress: 65,
      schedule: 'Thứ 3, 7:00 - 9:00',
      room: 'TC-205',
      lessonProgress: '16/24',
    },
  ],
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
