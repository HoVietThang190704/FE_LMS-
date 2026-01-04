import React from 'react';
import Link from 'next/link';
import type { Assignment, HomeClass, Notification, Stats, UserProfile } from '@/lib/types/home';
import type { TranslateFn } from '@/lib/shared/utils/translator';
import type { Course } from '@/lib/api/courses';
import HomeHero from './components/HomeHero';
import StatsGrid from './components/StatsGrid';
import RightPanel from './components/RightPanel';
import ClassCard from '@/components/card/ClassCard';
import CourseCard from '@/components/card/CourseCard';
import { ROUTES } from '@/lib/shared/constants/routeres';
import JoinByInvite from './components/JoinByInvite';

type HomeUIProps = {
  locale: 'en' | 'vi';
  t: TranslateFn;
  messages: Record<string, unknown>;
  user: UserProfile;
  stats: Stats;
  classes: HomeClass[];
  assignments: Assignment[];
  notifications: Notification[];
  courses: Course[];
};

export default function HomeUI({ locale, t, messages, user, stats, classes, assignments, notifications, courses }: HomeUIProps) {
  return (
    <div className="min-h-screen bg-gray-50" data-locale={locale}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <HomeHero user={user} t={t} />
        <StatsGrid stats={stats} t={t} />
        <section className="mt-10 space-y-6 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t('publicCourses.title')}</h2>
              <p className="text-sm text-gray-500">{t('publicCourses.subtitle', { count: courses.length })}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <JoinByInvite buttonLabel={t('publicCourses.joinByCode') || 'Tham gia bằng mã mời'} />
              <Link
                href={ROUTES.COURSES}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                {t('actions.viewCourses')}
              </Link>
            </div>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  messages={messages}
                  locale={locale}
                  enrolled={Boolean(course.isEnrolled || (course.tags || []).includes('enrolled'))}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">{t('publicCourses.empty')}</p>
          )}
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('classes.title')}</h2>
              <div className="space-y-4">
                {classes.map((classItem) => (
                  <ClassCard
                    key={classItem.id}
                    courseCode={classItem.courseCode}
                    courseName={classItem.courseName}
                    instructor={classItem.instructor}
                    progress={classItem.progress}
                    schedule={classItem.schedule}
                    room={classItem.room}
                    lessonProgress={classItem.lessonProgress}
                    lessonLabel={t('classes.lessonUnit')}
                    enterLabel={t('classes.enterButton')}
                    actionHref={ROUTES.CLASSROOM(String(classItem.id))}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <RightPanel assignments={assignments} notifications={notifications} t={t} />
          </div>
        </div>
      </div>
    </div>
  );
}
