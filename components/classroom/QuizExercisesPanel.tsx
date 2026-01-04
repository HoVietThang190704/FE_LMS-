'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, CheckCircle, AlertCircle, PlayCircle } from 'lucide-react';
import { getQuizzesByCourse, getMyQuizSubmissions } from '@/lib/services/profile/profile.service';
import type { QuizExercise, QuizSubmission } from '@/lib/types/profile';
import { createTranslator } from '@/lib/shared/utils/translator';

interface QuizExercisesPanelProps {
  courseId: string;
  messages?: Record<string, unknown>;
}

export default function QuizExercisesPanel({
  courseId,
  messages,
}: QuizExercisesPanelProps) {
  const [quizzes, setQuizzes] = useState<QuizExercise[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, QuizSubmission[]>>({});
  const [loading, setLoading] = useState(true);
  const t = createTranslator(messages || {});

  useEffect(() => {
    const loadQuizzes = async () => {
      setLoading(true);
      try {
        const data = await getQuizzesByCourse(courseId);
        setQuizzes(data);

        const subs: Record<string, QuizSubmission[]> = {};
        await Promise.all(
          data.map(async (quiz) => {
            try {
              subs[quiz.id] = await getMyQuizSubmissions(quiz.id);
            } catch {
              subs[quiz.id] = [];
            }
          })
        );
        setSubmissions(subs);
      } catch {
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, [courseId]);

  const getQuizStatus = (quizId: string) => {
    const subs = submissions[quizId] || [];
    if (subs.length === 0) return 'not-started';
    const passed = subs.some(s => s.passed);
    return passed ? 'passed' : 'attempted';
  };

  const getBestScore = (quizId: string) => {
    const subs = submissions[quizId] || [];
    if (subs.length === 0) return null;
    return Math.max(...subs.map(s => s.percentage));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-4">
        {t('classroom.noQuizzes', 'Không có bài tập trắc nghiệm.')}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {quizzes.map((quiz) => {
        const status = getQuizStatus(quiz.id);
        const bestScore = getBestScore(quiz.id);

        return (
          <div
            key={quiz.id}
            className="border border-gray-200 rounded-lg p-4 bg-white hover:border-purple-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    #{quiz.order}
                  </span>
                  <h4 className="font-semibold text-gray-900">{quiz.title}</h4>
                  {status === 'passed' && (
                    <CheckCircle size={16} className="text-green-600" />
                  )}
                  {status === 'attempted' && (
                    <AlertCircle size={16} className="text-yellow-600" />
                  )}
                </div>
                {quiz.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {quiz.description}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {quiz.questions.length} câu hỏi
                  </span>
                  {quiz.timeLimit && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {quiz.timeLimit} phút
                    </span>
                  )}
                  <span>Điểm đạt: {quiz.passingScore}%</span>
                  {bestScore !== null && (
                    <span className={`font-medium ${bestScore >= quiz.passingScore ? 'text-green-600' : 'text-yellow-600'}`}>
                      Điểm cao nhất: {bestScore.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
              <Link
                href={`/my-profile/courses/${courseId}/learn/quiz/${quiz.id}`}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm flex-shrink-0 flex items-center gap-2"
              >
                <PlayCircle size={16} />
                {status === 'not-started' ? 'Làm bài' : 'Làm lại'}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
