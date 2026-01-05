'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Code, CheckCircle, AlertCircle, PlayCircle, Clock, CalendarX, CalendarClock } from 'lucide-react';
import { getPracticesByCourse, getMyPracticeSubmissions } from '@/lib/services/profile/profile.service';
import type { PracticeExercise, PracticeSubmission } from '@/lib/types/profile';
import { createTranslator } from '@/lib/shared/utils/translator';

interface PracticeExercisesPanelProps {
  courseId: string;
  messages?: Record<string, unknown>;
}

function isExerciseExpired(endDate?: string): boolean {
  if (!endDate) return false;
  return new Date(endDate) < new Date();
}

function isExerciseNotStarted(startDate?: string): boolean {
  if (!startDate) return false;
  return new Date(startDate) > new Date();
}

function formatDateTime(dateString?: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function PracticeExercisesPanel({
  courseId,
  messages,
}: PracticeExercisesPanelProps) {
  const [practices, setPractices] = useState<PracticeExercise[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, PracticeSubmission[]>>({});
  const [loading, setLoading] = useState(true);
  const t = createTranslator(messages || {});

  useEffect(() => {
    const loadPractices = async () => {
      setLoading(true);
      try {
        const data = await getPracticesByCourse(courseId);
        setPractices(data);

        const subs: Record<string, PracticeSubmission[]> = {};
        await Promise.all(
          data.map(async (practice) => {
            try {
              subs[practice.id] = await getMyPracticeSubmissions(practice.id);
            } catch {
              subs[practice.id] = [];
            }
          })
        );
        setSubmissions(subs);
      } catch {
        setPractices([]);
      } finally {
        setLoading(false);
      }
    };
    loadPractices();
  }, [courseId]);

  const getPracticeStatus = (practiceId: string) => {
    const subs = submissions[practiceId] || [];
    if (subs.length === 0) return 'not-started';
    const passed = subs.some(s => s.passed);
    return passed ? 'passed' : 'attempted';
  };

  const getBestScore = (practiceId: string) => {
    const subs = submissions[practiceId] || [];
    if (subs.length === 0) return null;
    return Math.max(...subs.map(s => s.percentage));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!practices || practices.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-4">
        {t('classroom.noPractices', 'Không có bài tập thực hành.')}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {practices.map((practice) => {
        const status = getPracticeStatus(practice.id);
        const bestScore = getBestScore(practice.id);
        const expired = isExerciseExpired(practice.endDate);
        const notStarted = isExerciseNotStarted(practice.startDate);

        return (
          <div
            key={practice.id}
            className={`border rounded-lg p-4 bg-white transition-all ${
              expired ? 'border-gray-300 bg-gray-50 opacity-75' : 
              notStarted ? 'border-yellow-200 bg-yellow-50' :
              'border-gray-200 hover:border-green-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    #{practice.order}
                  </span>
                  <h4 className="font-semibold text-gray-900">{practice.title}</h4>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    practice.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    practice.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {practice.difficulty === 'easy' ? 'Dễ' :
                     practice.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                  </span>
                  {expired && (
                    <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded">
                      <CalendarX size={12} />
                      Đã hết hạn
                    </span>
                  )}
                  {notStarted && (
                    <span className="flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">
                      <CalendarClock size={12} />
                      Chưa bắt đầu
                    </span>
                  )}
                  {!expired && !notStarted && status === 'passed' && (
                    <CheckCircle size={16} className="text-green-600" />
                  )}
                  {!expired && !notStarted && status === 'attempted' && (
                    <AlertCircle size={16} className="text-yellow-600" />
                  )}
                </div>
                {practice.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {practice.description}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                    <Code size={12} />
                    {practice.language}
                  </span>
                  <span>{practice.testCases.length} test cases</span>
                  {bestScore !== null && (
                    <span className={`font-medium ${bestScore >= 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                      Điểm cao nhất: {bestScore.toFixed(0)}%
                    </span>
                  )}
                  {practice.endDate && !expired && (
                    <span className="flex items-center gap-1 text-orange-600">
                      <Clock size={12} />
                      Hết hạn: {formatDateTime(practice.endDate)}
                    </span>
                  )}
                  {practice.startDate && notStarted && (
                    <span className="flex items-center gap-1 text-yellow-700">
                      <CalendarClock size={12} />
                      Bắt đầu: {formatDateTime(practice.startDate)}
                    </span>
                  )}
                </div>
              </div>
              {expired ? (
                <span className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg font-medium text-sm flex-shrink-0 cursor-not-allowed">
                  Đã hết hạn
                </span>
              ) : notStarted ? (
                <span className="px-4 py-2 bg-yellow-200 text-yellow-700 rounded-lg font-medium text-sm flex-shrink-0 cursor-not-allowed">
                  Chưa mở
                </span>
              ) : (
                <Link
                  href={`/my-profile/courses/${courseId}/learn/practice/${practice.id}`}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex-shrink-0 flex items-center gap-2"
                >
                  <PlayCircle size={16} />
                  {status === 'not-started' ? 'Làm bài' : 'Làm lại'}
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
