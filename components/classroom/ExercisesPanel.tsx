import React from 'react';
import Link from 'next/link';
import { Play, Clock, CheckCircle } from 'lucide-react';
import type { Exercise } from '@/lib/types/exercises';
import { createTranslator } from '@/lib/shared/utils/translator';

export default function ExercisesPanel({ exercises, messages }: { exercises: Exercise[]; messages?: Record<string, unknown> }) {
  const t = createTranslator(messages || {});

  if (!exercises || exercises.length === 0) return <div className="text-sm text-gray-500">{t('classroom.noExercises', 'Không có bài tập.')}</div>;

  return (
    <div className="space-y-4">
      {exercises.map((ex) => (
        <div key={ex.id} className="border border-gray-200 rounded-lg p-4 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" size={18} />
            <div>
              <div className="font-medium text-gray-900">{ex.title}</div>
              <div className="text-xs text-gray-500">{ex.difficulty} · {ex.language}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 flex items-center gap-2"><Clock size={14} /> {ex.timeLimit ? t('classroom.durationSeconds', `${Math.round(ex.timeLimit / 1000)}s`).replace('{s}', String(Math.round(ex.timeLimit / 1000))) : '—'}</div>
            <Link href={`/exercises/${ex.id}`} className="px-3 py-1 bg-black text-white rounded-md text-sm inline-flex items-center gap-2">
              <Play size={14} /> {t('classroom.learn', 'Học')}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
