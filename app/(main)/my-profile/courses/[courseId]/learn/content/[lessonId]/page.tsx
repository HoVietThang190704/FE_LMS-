'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle, BookOpen, FileUp, Link as LinkIcon } from 'lucide-react';
import { getLessonById } from '@/lib/services/lessons/lessons.service';
import type { ClassroomLesson } from '@/lib/types/classroom';
import { getMessages, DEFAULT_LOCALE } from '@/app/i18n';

const REQUIRED_DWELL_TIME = 30;

export default function LearnContentPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const messages = getMessages(DEFAULT_LOCALE) as Record<string, Record<string, string>>;

  const [lesson, setLesson] = useState<ClassroomLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(REQUIRED_DWELL_TIME);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getProgress = useCallback((): Record<string, boolean> => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem(`lesson-progress:${courseId}`);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, [courseId]);

  const saveProgress = useCallback((id: string) => {
    if (typeof window === 'undefined') return;
    const progress = getProgress();
    progress[id] = true;
    localStorage.setItem(`lesson-progress:${courseId}`, JSON.stringify(progress));
  }, [courseId, getProgress]);

  useEffect(() => {
    async function fetchLesson() {
      setLoading(true);
      try {
        const data = await getLessonById(courseId, lessonId);
        setLesson(data);
        
        const progress = getProgress();
        if (progress[lessonId]) {
          setIsCompleted(true);
          setTimeRemaining(0);
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLesson();
  }, [courseId, lessonId, getProgress]);

  useEffect(() => {
    if (isCompleted || loading || !lesson) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsCompleted(true);
          saveProgress(lessonId);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCompleted, loading, lesson, lessonId, saveProgress]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">Không tìm thấy bài học</p>
          <Link
            href={`/my-profile/courses/${courseId}/learn`}
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            <ArrowLeft size={18} />
            <span>Quay lại</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href={`/my-profile/courses/${courseId}/learn`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>{messages.exercises?.back || 'Quay lại'}</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {isCompleted ? (
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              ) : (
                <div className="p-2 bg-blue-100 rounded-full">
                  <Clock size={24} className="text-blue-600" />
                </div>
              )}
              <div>
                {isCompleted ? (
                  <p className="font-semibold text-green-700">Đã hoàn thành bài học!</p>
                ) : (
                  <p className="font-semibold text-gray-900">
                    Còn {timeRemaining} giây để hoàn thành
                  </p>
                )}
              </div>
            </div>
            
            {!isCompleted && (
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all duration-1000"
                  style={{ width: `${((REQUIRED_DWELL_TIME - timeRemaining) / REQUIRED_DWELL_TIME) * 100}%` }}
                />
              </div>
            )}
          </div>
          
          {!isCompleted && (
            <p className="text-sm text-gray-500">
              Hãy ở lại trang này ít nhất 30 giây để được tính là đã học bài.
            </p>
          )}
        </div>

        {/* Lesson content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Tuần {lesson.week}</span>
            {lesson.durationMinutes && (
              <span className="flex items-center gap-1">
                <Clock size={14} /> {lesson.durationMinutes} phút
              </span>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
          
          {lesson.description && (
            <div className="prose max-w-none text-gray-700 mb-6">
              <p>{lesson.description}</p>
            </div>
          )}
        </div>

        {lesson.resources && lesson.resources.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tài nguyên đính kèm</h2>
            <div className="space-y-3">
              {lesson.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    {resource.type === 'link' ? (
                      <LinkIcon size={20} className="text-blue-600" />
                    ) : (
                      <FileUp size={20} className="text-gray-600" />
                    )}
                    <span className="font-medium text-gray-900">{resource.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {resource.type === 'link' ? 'Mở link' : 'Tải xuống'}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
