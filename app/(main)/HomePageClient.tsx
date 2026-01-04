"use client";

import { useEffect, useMemo, useState } from 'react';
import HomeUI from './home-ui';
import { createTranslator } from '@/lib/shared/utils/translator';
import { fetchFromApi } from '@/lib/shared/utils/api';
import { STORAGE_KEYS } from '@/lib/shared/constants/storage';
import type { Assignment, HomeClass, Notification, Stats, UserProfile } from '@/lib/types/home';
import type { Course } from '@/lib/api/courses';

export type HomePayload = {
  user: UserProfile;
  stats: Stats;
  classes: HomeClass[];
  assignments: Assignment[];
  notifications: Notification[];
  courses: Course[];
};

type HomePageClientProps = {
  locale: 'en' | 'vi';
  messages: Record<string, unknown>;
  initialData: HomePayload;
};

const EMPTY_HOME: HomePayload = {
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

export default function HomePageClient({ locale, messages, initialData }: HomePageClientProps) {
  const [data, setData] = useState<HomePayload>(initialData || EMPTY_HOME);
  const t = useMemo(() => createTranslator(messages), [messages]);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    if (!token) return;

    const controller = new AbortController();

    fetchFromApi<HomePayload>('/api/home', {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then((payload) => {
        if (payload) setData(payload);
      })
      .catch((error) => {
        console.error('[HomePage] reload failed', error);
      });

    return () => controller.abort();
  }, []);

  return (
    <HomeUI
      locale={locale}
      t={t}
      messages={messages}
      user={data.user}
      stats={data.stats}
      classes={data.classes}
      assignments={data.assignments}
      notifications={data.notifications}
      courses={data.courses}
    />
  );
}
