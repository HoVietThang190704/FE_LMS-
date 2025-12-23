import React from 'react';
import AssignmentCard from '@/components/card/AssignmentCard';
import type { Assignment, Notification } from '@/lib/types/home';
import type { TranslateFn } from '@/lib/shared/utils/translator';

type Props = {
  assignments: Assignment[];
  notifications: Notification[];
  t: TranslateFn;
};

export default function RightPanel({ assignments, notifications, t }: Props) {
  const assignmentStatusLabels = {
    pending: t('assignmentStatus.pending'),
    'in-progress': t('assignmentStatus.inProgress'),
    completed: t('assignmentStatus.completed'),
  } as const;

  return (
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
        <h2 className="text-xl font-bold text-gray-900 mb-6">{t('notifications.title')}</h2>
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
  );
}
