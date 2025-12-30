"use client";

import React, { useState } from 'react';
import type { Exercise } from '@/lib/types/exercises';
import ExercisesPanel from './ExercisesPanel';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { createTranslator } from '@/lib/shared/utils/translator';

type Lesson = {
  title: string;
  duration: string;
  completed: boolean;
};

type Week = {
  title: string;
  lessons: Lesson[];
};

export default function ClassroomTabs({ weeks, exercises, messages }: { weeks: Week[]; exercises: Exercise[]; messages: Record<string, unknown> }) {
  const [tab, setTab] = useState<'content' | 'resources' | 'assignments'>('content');
  const t = createTranslator(messages || {});

  return (
    <div>
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-4 text-sm">
          <button
            onClick={() => setTab('content')}
            className={`px-4 py-2 ${tab === 'content' ? 'border-b-2 border-black font-semibold' : 'text-gray-500'}`}
          >
            {t('classroom.contentTab', 'Nội dung')}
          </button>
          <button
            onClick={() => setTab('resources')}
            className={`px-4 py-2 ${tab === 'resources' ? 'border-b-2 border-black font-semibold' : 'text-gray-500'}`}
          >
            {t('classroom.resourcesTab', 'Tài nguyên')}
          </button>
          <button
            onClick={() => setTab('assignments')}
            className={`px-4 py-2 ${tab === 'assignments' ? 'border-b-2 border-black font-semibold' : 'text-gray-500'}`}
          >
            {t('classroom.assignmentsTab', 'Bài tập')}
          </button>
        </div>
      </div>

      <div>
        {tab === 'content' && (
          <div className="space-y-4">
            {weeks.map((week) => (
              <div key={week.title} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-3">{week.title}</h3>
                <div className="space-y-3">
                  {week.lessons.map((lesson) => (
                    <div key={lesson.title} className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
                      <div className="flex items-center gap-3 text-gray-800">
                        {lesson.completed ? (
                          <CheckCircle2 className="text-green-600" size={18} />
                        ) : (
                          <Circle className="text-gray-400" size={18} />
                        )}
                        <span className="font-medium">{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={16} />
                        <span>{lesson.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'resources' && (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl p-4 bg-white text-sm text-gray-600">{t('classroom.noResources', 'Chưa có tài nguyên. Thêm tài nguyên ở đây.')}</div>
          </div>
        )}

        {tab === 'assignments' && (
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <h3 className="font-semibold text-gray-900 mb-3">{t('classroom.assignmentsTab', 'Bài tập')}</h3>
            <ExercisesPanel exercises={exercises} messages={messages} />
          </div>
        )}
      </div>
    </div>
  );
}
