import React from 'react';
import { BookOpen, Clock, Trophy, TrendingUp } from 'lucide-react';
import StatsCard from '@/components/card/StatsCard';
import type { Stats } from '@/lib/types/home';
import type { TranslateFn } from '@/lib/shared/utils/translator';

type Props = {
  stats: Stats;
  t: TranslateFn;
};

const ICON_MAP = {
  enrolledCourses: BookOpen,
  pendingAssignments: Clock,
  averageGrade: Trophy,
  learningProgress: TrendingUp,
} as const;

export default function StatsGrid({ stats, t }: Props) {
  const items = [
    { key: 'enrolledCourses', title: t('stats.enrolledCourses'), value: stats.enrolledCourses },
    { key: 'pendingAssignments', title: t('stats.pendingAssignments'), value: stats.pendingAssignments },
    { key: 'averageGrade', title: t('stats.averageGrade'), value: stats.averageGrade },
    { key: 'learningProgress', title: t('stats.learningProgress'), value: `${stats.learningProgress}%` },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {items.map((item) => (
        <StatsCard
          key={item.key}
          title={item.title}
          value={item.value}
          icon={ICON_MAP[item.key as keyof typeof ICON_MAP]}
          bgColor="bg-white"
          iconColor="text-indigo-600"
        />
      ))}
    </div>
  );
}
