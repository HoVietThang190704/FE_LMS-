import React from 'react';
import CoursesPageClient from './CoursesPageClient';
import { getPublicCourses } from '@/lib/services/courses/service';
import { mockClasses } from '@/lib/mocks/homeData';

export default async function CoursesPage() {
  // server-side fetch initial courses — try backend public API first, fallback to mocks
  const { data } = await getPublicCourses({ page: 1, limit: 100 });

  let initialCourses = data;

  if (!initialCourses || initialCourses.length === 0) {
    // fallback: convert mockClasses to Course shape
    initialCourses = mockClasses.map((m) => ({
      id: String(m.id),
      code: m.courseCode,
      name: m.courseName,
      description: '',
      instructor: m.instructor,
      schedule: m.schedule,
      room: m.room,
      tags: ['enrolled'], 
      credits: 3,
      enrolled: 45,
      capacity: 60,
      image: m.image,
    }));
  }

  return <CoursesPageClient initialCourses={initialCourses} />;
}
