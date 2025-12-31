'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Users, Tag, Share2, BookOpen, Clock } from 'lucide-react';
import type { Course } from '@/lib/api/courses';
import { enrollCourse } from '@/lib/api/enrollments';
import { createTranslator } from '@/lib/shared/utils/translator';
import { ROUTES } from '@/lib/shared/constants/routeres';
import { useToast } from '@/app/hooks/useToast';

interface CourseDetailClientProps {
  course: Course;
  messages: Record<string, unknown>;
  locale: 'en' | 'vi';
}

export default function CourseDetailClient({ course, messages, locale }: CourseDetailClientProps) {
  const toast = useToast();
  const rawImage = course.image?.trim();
  const imageSrc = rawImage
    ? rawImage.startsWith('http') || rawImage.startsWith('/')
      ? rawImage
      : `/images/demo/${rawImage}`
    : `/images/demo/default.svg`;

  const t = createTranslator(messages);

  const [isEnrolled, setIsEnrolled] = useState<boolean>(Boolean(course.isEnrolled || (course.tags || []).includes('enrolled')));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seatsAvailable = useMemo(() => (course.capacity ?? 0) - (course.enrolled ?? 0), [course.capacity, course.enrolled]);

  const handleEnroll = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await enrollCourse(String(course.id));
      setIsEnrolled(true);
      toast.success(t('enrollDialog.success', 'Đăng ký môn học thành công'));
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string'
          ? (err as any).message
          : t('enrollDialog.failure', 'Đăng ký thất bại');
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" data-locale={locale}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link href={ROUTES.HOME} className="hover:underline">{t('nav.home', 'Trang chủ')}</Link>
          <span className="px-2">/</span>
          <Link href={ROUTES.COURSES} className="hover:underline">{t('nav.courses', 'Khóa học')}</Link>
          <span className="px-2">/</span>
          <span className="text-gray-900 font-semibold">{course.name}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="relative h-60 md:h-72 lg:h-96">
            <Image src={imageSrc} alt={course.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50" />
            <div className="absolute left-6 bottom-6 right-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">{course.code}</span>
                  {course.status && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {course.status === 'active' ? t('courseDetail.active','Active') : t('courseDetail.archived','Archived')}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{course.name}</h1>
                {course.description && <p className="text-gray-200 mt-2 hidden md:block">{course.description}</p>}
              </div>

              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 bg-white/10 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition">
                  <Share2 className="w-4 h-4" /> {t('courseDetail.share','Share')}
                </button>
                <div className="bg-white rounded-lg p-3 text-sm text-gray-700">
                  <div className="font-semibold text-lg">{course.enrolled ?? 0}/{course.capacity ?? '—'}</div>
                  <div className="text-xs text-gray-500">{t('courseDetail.enrolled','Enrolled')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-bold text-gray-900">{t('courseDetail.overview','Overview')}</h2>
                <div className="text-sm text-gray-500">{course.code}</div>
              </div>

              <div className="mt-4 text-gray-700 leading-relaxed">
                {course.description ?? <span className="text-gray-400">{t('courseDetail.noData','No description available')}</span>}
              </div>

              {/* Learning objectives placeholder or syllabus */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('courseDetail.learningObjectives','Learning objectives')}</h3>
                {course.syllabus && course.syllabus.length > 0 ? (
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    {course.syllabus.map((s, i) => (
                      <li key={i}>
                        <div className="text-sm font-medium text-gray-700">{s.title}</div>
                        {s.description && <div className="text-sm text-gray-500">{s.description}</div>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>{t('courseDetail.learningObjectivesItem1','Understand basic concepts')}</li>
                    <li>{t('courseDetail.learningObjectivesItem2','Apply practical examples')}</li>
                    <li>{t('courseDetail.learningObjectivesItem3','Build a small project')}</li>
                  </ul>
                )}
              </div>
            </section>

            {/* Syllabus */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{t('courseDetail.syllabus','Syllabus')}</h3>
                <div className="text-sm text-gray-500">{t('courseDetail.duration','Duration')}: {course.credits ?? '—'} {t('courseDetail.creditsShort','cr')}</div>
              </div>

              <div className="mt-4 space-y-2">
                {/* If there's a real syllabus, render it; otherwise show sample */}
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="text-sm font-medium text-gray-700">{t('courseDetail.syllabusItem1','Introduction & Setup')}</div>
                    <div className="text-sm text-gray-500">{t('courseDetail.syllabusItem1Desc','Course overview and environment setup')}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="text-sm font-medium text-gray-700">{t('courseDetail.syllabusItem2','Core Topics')}</div>
                    <div className="text-sm text-gray-500">{t('courseDetail.syllabusItem2Desc','Main topics and hands-on labs')}</div>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <aside className="space-y-6">
            {/* Enroll CTA */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col gap-3">
                <div className="text-sm text-gray-600">{t('courseDetail.seats','Seats available')}</div>
                <div className="text-2xl font-bold text-gray-900">{seatsAvailable > 0 ? seatsAvailable : t('courseDetail.full','Full')}</div>
                <button
                  disabled={isEnrolled || seatsAvailable <= 0 || isLoading}
                  onClick={handleEnroll}
                  className={`mt-3 w-full rounded-lg py-2 font-semibold transition ${
                    isEnrolled
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } ${isLoading ? 'opacity-80' : ''}`}
                >
                  {isEnrolled ? t('courseCard.registered','Đã đăng ký') : isLoading ? t('enrollDialog.loading','Đang xử lý...') : t('courseDetail.enroll','Enroll now')}
                </button>
                {error && <div className="text-xs text-red-500">{error}</div>}
                <div className="text-xs text-gray-500 mt-2">{t('courseDetail.refundPolicy','Refund policy info')}</div>
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">{t('courseDetail.instructor','Instructor')}</h4>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">{(course.instructor || 'NA').slice(0,1)}</div>
                <div>
                  <div className="font-semibold text-gray-900">{course.instructor ?? t('courseDetail.noData','N/A')}</div>
                  <div className="text-sm text-gray-500">{t('courseDetail.instructorBioShort','Instructor bio not available')}</div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {course.tags && course.tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('courseDetail.tags','Tags')}</h4>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 text-sm bg-gray-100 rounded-md text-gray-700">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}