import React from 'react';
import CoursesPageClient from './CoursesPageClient';
import { getPublicCourses } from '@/lib/services/courses/service';

export default async function CoursesPage() {
  const { data } = await getPublicCourses({ page: 1, limit: 100 });

  let initialCourses = data;

  if (!initialCourses || initialCourses.length === 0) {
    initialCourses = [];
  }

  return <CoursesPageClient initialCourses={initialCourses} />;
}
