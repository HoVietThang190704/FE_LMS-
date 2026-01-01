'use client';

import React, { useState, useEffect } from 'react';
import type { Exam } from '@/lib/types/exams';
import { getExams } from '@/lib/services/exercises/exam.service';
import { createTranslator } from '@/lib/shared/utils/translator';

interface TheoreticalExercisesPanelProps {
  courseId: string;
  messages?: Record<string, unknown>;
}

export default function TheoreticalExercisesPanel({
  courseId,
  messages,
}: TheoreticalExercisesPanelProps) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const t = createTranslator(messages || {});

  useEffect(() => {
    const loadExams = async () => {
      setLoading(true);
      try {
        const data = await getExams(courseId);
        setExams(data);
      } catch {
        setExams([]);
      } finally {
        setLoading(false);
      }
    };
    loadExams();
  }, [courseId]);

  if (loading) {
    return <div className="text-sm text-gray-500">Đang tải...</div>;
  }

  if (!exams || exams.length === 0) {
    return <div className="text-sm text-gray-500">Không có bài tập lý thuyết.</div>;
  }

  return (
    <div className="space-y-3">
      {exams.map((exam) => (
        <div
          key={exam._id}
          className="border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 mb-1">{exam.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {exam.description}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  Câu {exam.order}
                </span>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex-shrink-0">
              Làm bài
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
