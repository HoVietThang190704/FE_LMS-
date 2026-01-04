'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { ProgressDetails } from '@/lib/types/classroom';

type ClassroomProgressProps = {
  courseId: string;
  totalLessons: number;
  initialProgress?: number;
  progressDetails?: ProgressDetails;
};

function readLocalProgress(courseId: string): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(`lesson-progress:${courseId}`);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('[ClassroomProgress] cannot parse local progress', error);
    return {};
  }
}

export default function ClassroomProgress({ 
  courseId, 
  totalLessons, 
  initialProgress,
  progressDetails 
}: ClassroomProgressProps) {
  const [localProgress, setLocalProgress] = useState<Record<string, boolean>>(() => readLocalProgress(courseId));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== `lesson-progress:${courseId}`) return;
      setLocalProgress(readLocalProgress(courseId));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [courseId]);

  // Tính tiến độ đọc nội dung từ local storage
  const lessonPercent = useMemo(() => {
    if (totalLessons <= 0) return 0;
    const completed = Object.entries(localProgress).filter(([, done]) => done).length;
    return Math.min(100, Math.round((completed / totalLessons) * 100));
  }, [localProgress, totalLessons]);

  // Tính tiến độ tổng hợp: bao gồm cả nội dung + bài tập
  const percent = useMemo(() => {
    if (progressDetails) {
      const { totalExercises, completedExercises } = progressDetails;
      
      // Tổng số items = lessons + exercises
      const totalItems = totalLessons + totalExercises;
      if (totalItems <= 0) return 0;
      
      // Số đã hoàn thành = lessons đã đọc + bài tập đã làm
      const completedLessons = Object.entries(localProgress).filter(([, done]) => done).length;
      const completedItems = completedLessons + completedExercises;
      
      return Math.min(100, Math.round((completedItems / totalItems) * 100));
    }
    
    // Nếu có initialProgress từ server thì dùng nó
    if (typeof initialProgress === 'number' && initialProgress > 0) {
      return initialProgress;
    }
    
    // Fallback: chỉ tính lessons nếu không có thông tin bài tập
    return lessonPercent;
  }, [localProgress, totalLessons, initialProgress, progressDetails, lessonPercent]);

  // Tính toán thông tin hiển thị chi tiết
  const displayInfo = useMemo(() => {
    const completedLessons = Object.entries(localProgress).filter(([, done]) => done).length;
    
    if (progressDetails) {
      const { totalExercises, completedExercises, quizProgress, practiceProgress } = progressDetails;
      const totalItems = totalLessons + totalExercises;
      const completedItems = completedLessons + completedExercises;
      
      return {
        label: `${completedItems}/${totalItems} hoàn thành`,
        tooltip: `Nội dung: ${completedLessons}/${totalLessons} | Trắc nghiệm: ${quizProgress.completed}/${quizProgress.total} | Thực hành: ${practiceProgress.completed}/${practiceProgress.total}`
      };
    }
    return {
      label: 'Tiến độ học tập',
      tooltip: ''
    };
  }, [progressDetails, localProgress, totalLessons]);

  // Chi tiết tiến độ từng phần
  const completedLessons = Object.entries(localProgress).filter(([, done]) => done).length;

  return (
    <div>
      <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
        <span title={displayInfo.tooltip}>{displayInfo.label}</span>
        <span className="font-semibold">{percent}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="h-2 rounded-full bg-black transition-all duration-300" 
          style={{ width: `${percent}%` }} 
        />
      </div>
      {/* Hiển thị chi tiết tiến độ */}
      <div className="mt-2 text-xs text-gray-500 space-y-1">
        <div className="flex justify-between">
          <span>Nội dung</span>
          <span>{completedLessons}/{totalLessons}</span>
        </div>
        {progressDetails && (
          <>
            <div className="flex justify-between">
              <span>Trắc nghiệm</span>
              <span>{progressDetails.quizProgress.completed}/{progressDetails.quizProgress.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Thực hành</span>
              <span>{progressDetails.practiceProgress.completed}/{progressDetails.practiceProgress.total}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
