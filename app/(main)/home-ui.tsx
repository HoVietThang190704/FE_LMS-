import React from 'react';
import { BookOpen, Clock, Trophy, TrendingUp, Bell } from 'lucide-react';
import AssignmentCard from '@/components/card/AssignmentCard';
import ClassCard from '@/components/card/ClassCard';
import StatsCard from '@/components/card/StatsCard';
import type { Assignment, Course, Notification, Stats, UserProfile } from '@/lib/types/home';
import type { TranslateFn } from '@/lib/shared/utils/translator';

type HomeUIProps = {
  locale: 'en' | 'vi';
  t: TranslateFn;
  user: UserProfile;
  stats: Stats;
  classes: Course[];
  assignments: Assignment[];
  notifications: Notification[];
};

export default function HomeUI({ locale, t, user, stats, classes, assignments, notifications }: HomeUIProps) {
  const assignmentStatusLabels = {
    pending: t('assignmentStatus.pending'),
    'in-progress': t('assignmentStatus.inProgress'),
    completed: t('assignmentStatus.completed'),
  } as const;

  return (
    <div className="min-h-screen bg-gray-50" data-locale={locale}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('greeting.hello', { name: user.name })}</h1>
          <p className="text-gray-600">{t('greeting.welcome')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title={t('stats.enrolledCourses')}
            value={stats.enrolledCourses}
            icon={BookOpen}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatsCard
            title={t('stats.pendingAssignments')}
            value={stats.pendingAssignments}
            icon={Clock}
            bgColor="bg-yellow-50"
            iconColor="text-yellow-600"
          />
          <StatsCard
            title={t('stats.averageGrade')}
            value={stats.averageGrade}
            icon={Trophy}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatsCard
            title={t('stats.learningProgress')}
            value={`${stats.learningProgress}%`}
            icon={TrendingUp}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('classes.title')}</h2>
              <div className="space-y-4">
                {classes.map((classItem) => (
                  <ClassCard
                    key={classItem.id}
                    {...classItem}
                    lessonLabel={t('classes.lessonUnit')}
                    enterLabel={t('classes.enterButton')}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('assignments.title')}</h2>
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    {...assignment}
                    deadlineLabel={t('assignments.deadlineLabel')}
                    statusLabelMap={assignmentStatusLabels}
                  />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Bell size={20} className="text-gray-900" />
                <h2 className="text-xl font-bold text-gray-900">{t('notifications.title')}</h2>
              </div>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">{notification.title}</h4>
                    <p className="text-xs text-gray-600 mb-1">{notification.description}</p>
                    <p className="text-xs text-gray-400">{notification.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
