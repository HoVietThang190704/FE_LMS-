"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Circle, Clock, FileDown, Link as LinkIcon, ArrowUpRight } from 'lucide-react';
import type { ClassroomResource, ClassroomLesson } from '@/lib/types/classroom';
import QuizExercisesPanel from './QuizExercisesPanel';
import PracticeExercisesPanel from './PracticeExercisesPanel';
import { createTranslator } from '@/lib/shared/utils/translator';

type Week = {
  title: string;
  week: number;
  lessons: ClassroomLesson[];
};

interface ClassroomTabsProps {
  weeks: Week[];
  resources: ClassroomResource[];
  courseId?: string;
  messages: Record<string, unknown>;
}

export default function ClassroomTabs({
  weeks,
  resources,
  courseId,
  messages,
}: ClassroomTabsProps) {
  const [tab, setTab] = useState<
    'content' | 'resources' | 'theoretical' | 'practical'
  >('content');
  const [progressMap, setProgressMap] = useState<Record<string, boolean>>({});
  const t = createTranslator(messages || {});
  const router = useRouter();

  // hydrate completion status from localStorage (shared with học bài page)
  useEffect(() => {
    if (!courseId || typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(`lesson-progress:${courseId}`);
      setProgressMap(stored ? JSON.parse(stored) : {});
    } catch (error) {
      console.warn('[ClassroomTabs] cannot read progress', error);
      setProgressMap({});
    }
  }, [courseId]);

  const resourcesByLesson = useMemo(() => {
    return resources.reduce<Record<string, ClassroomResource[]>>((acc, item) => {
      const key = item.lessonId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [resources]);

  return (
    <div>
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-4 text-sm overflow-x-auto">
          <button
            onClick={() => setTab('content')}
            className={`px-4 py-2 whitespace-nowrap ${
              tab === 'content'
                ? 'border-b-2 border-black font-semibold'
                : 'text-gray-500'
            }`}
          >
            {t('classroom.contentTab', 'Nội dung')}
          </button>
          <button
            onClick={() => setTab('resources')}
            className={`px-4 py-2 whitespace-nowrap ${
              tab === 'resources'
                ? 'border-b-2 border-black font-semibold'
                : 'text-gray-500'
            }`}
          >
            {t('classroom.resourcesTab', 'Tài nguyên')}
          </button>
          <button
            onClick={() => setTab('theoretical')}
            className={`px-4 py-2 whitespace-nowrap ${
              tab === 'theoretical'
                ? 'border-b-2 border-black font-semibold'
                : 'text-gray-500'
            }`}
          >
            Bài tập trắc nghiệm
          </button>
          <button
            onClick={() => setTab('practical')}
            className={`px-4 py-2 whitespace-nowrap ${
              tab === 'practical'
                ? 'border-b-2 border-black font-semibold'
                : 'text-gray-500'
            }`}
          >
            Bài tập thực hành
          </button>
        </div>
      </div>

      <div>
        {tab === 'content' && (
          <div className="space-y-4">
            {weeks.map((week) => (
              <div
                key={week.title}
                className="border border-gray-200 rounded-xl p-4 bg-gray-50"
              >
                <h3 className="font-semibold text-gray-900 mb-3">{week.title}</h3>
                <div className="space-y-3">
                  {week.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      role={courseId ? 'button' : undefined}
                      tabIndex={courseId ? 0 : -1}
                      onClick={() => {
                        if (!courseId) return;
                        router.push(`/my-profile/courses/${courseId}/learn/content/${lesson.id}`);
                      }}
                      onKeyDown={(e) => {
                        if (!courseId) return;
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          router.push(`/my-profile/courses/${courseId}/learn/content/${lesson.id}`);
                        }
                      }}
                      className="block bg-white rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 hover:shadow-sm transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 text-gray-800">
                          {progressMap[lesson.id] ? (
                            <CheckCircle2 className="text-green-600" size={18} />
                          ) : (
                            <Circle className="text-gray-400" size={18} />
                          )}
                          <span className="font-medium">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={16} />
                          <span>{lesson.durationMinutes ? `${lesson.durationMinutes} phút` : '—'}</span>
                          <ArrowUpRight size={16} className="text-gray-400" />
                        </div>
                      </div>

                      {resourcesByLesson[lesson.id] && resourcesByLesson[lesson.id].length > 0 && (
                        <div className="mt-3 pl-7 flex flex-wrap gap-2 text-xs text-gray-600">
                          {resourcesByLesson[lesson.id].map((res) => (
                            <a
                              key={`${res.lessonId}-${res.url}-${res.name}`}
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {res.type === 'link' ? <LinkIcon size={14} /> : <FileDown size={14} />}
                              <span className="font-medium text-gray-800">{res.name}</span>
                              <span className="text-gray-500">· {res.type === 'link' ? 'Link' : 'File'}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'resources' && (
          <div className="space-y-3">
            {resources && resources.length > 0 ? (
              resources.map((resource) => (
                <a
                  key={`${resource.lessonId}-${resource.url}-${resource.name}`}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-300 hover:shadow-sm transition"
                >
                  <div className="flex items-center gap-3 text-gray-800">
                    {resource.type === 'link' ? (
                      <LinkIcon className="text-blue-600" size={18} />
                    ) : (
                      <FileDown className="text-gray-700" size={18} />
                    )}
                    <div>
                      <div className="font-medium">{resource.name}</div>
                      <div className="text-xs text-gray-500">Tuần {resource.week} · {resource.lessonTitle}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{resource.type === 'link' ? 'Link' : 'File'}</div>
                </a>
              ))
            ) : (
              <div className="border border-gray-200 rounded-xl p-4 bg-white text-sm text-gray-600">
                {t(
                  'classroom.noResources',
                  'Chưa có tài nguyên. Thêm tài nguyên ở đây.'
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'theoretical' && (
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <h3 className="font-semibold text-gray-900 mb-4">
              Bài tập trắc nghiệm
            </h3>
            {courseId ? (
              <QuizExercisesPanel
                courseId={courseId}
                messages={messages}
              />
            ) : (
              <div className="text-sm text-gray-500">
                Không thể tải bài tập trắc nghiệm.
              </div>
            )}
          </div>
        )}

        {tab === 'practical' && (
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <h3 className="font-semibold text-gray-900 mb-4">
              Bài tập thực hành
            </h3>
            {courseId ? (
              <PracticeExercisesPanel
                courseId={courseId}
                messages={messages}
              />
            ) : (
              <div className="text-sm text-gray-500">
                Không thể tải bài tập thực hành.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
