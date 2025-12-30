import React from 'react';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getPublicCourseById } from '@/lib/api/courses';
import { getMessages } from '@/app/i18n';
import CourseDetailClient from './CourseDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function detectLocaleFromHeaders() {
  try {
    const h = await headers();
    const accept = h.get('accept-language') || '';
    if (accept.includes('vi')) return 'vi';
    return 'en';
  } catch (e) {
    return 'vi';
  }
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const locale: 'en' | 'vi' = await detectLocaleFromHeaders();
  const messages = getMessages(locale);

  const course = await getPublicCourseById(id);

  if (!course) {
    notFound();
  }

  return <CourseDetailClient course={course} messages={messages} locale={locale} />;
}